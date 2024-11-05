import { Buffer } from 'node:buffer';
import { DurableObject } from 'cloudflare:workers';
import { atom } from 'synchronization-atom';
import { z } from 'zod';
import puppeteer, { type Browser } from '@cloudflare/puppeteer';

export class JonogonRenderingDurableObject extends DurableObject {
	public semaphoreAtom = atom(2 /* no. of seats */);
	public browsers: [Browser | null, Browser | null] = [null, null];

	constructor(
		public ctx: DurableObjectState,
		public env: Env,
	) {
		super(ctx, env);
	}

	async capture(config: { url: string; w: number; h: number }): Promise<Response> {
		// acquire
		const seatNumber = await this.semaphoreAtom.conditionallyUpdate(
			(seats) => seats > 0,
			(seats) => seats - 1,
		);

		try {
			if (!this.browsers[seatNumber] || !this.browsers[seatNumber].isConnected()) {
				const activeSessions = await puppeteer.sessions(this.env.BROWSER);

				const freeSessions = activeSessions.filter((activeSession) => {
					return !activeSession.connectionId; // remove sessions with workers connected to them
				});

				if (freeSessions.length) {
					this.browsers[seatNumber] = await puppeteer.connect(this.env.BROWSER, freeSessions[0].sessionId);
				} else {
					if (activeSessions.length >= 2) {
						return Response.json(
							{
								message: 'all sessions are in use',
							},
							{
								status: 429,
							},
						);
					} else {
						this.browsers[seatNumber] = await puppeteer.launch(this.env.BROWSER);
					}
				}
			}

			const browser = this.browsers[seatNumber]!;

			const page = await browser.newPage();

			await page.setViewport({
				width: config.w,
				height: config.h,
			});

			await page.goto(config.url, {
				waitUntil: 'networkidle0',
			});

			const screenshot = await page.screenshot({ type: 'png', encoding: 'binary' });

			return new Response(screenshot, {
				headers: {
					'Content-Type': 'image/png',
				},
			});
		} catch (error) {
			console.error(error);

			return Response.json(
				{
					message: 'something went from while capturing the page',
				},
				{
					status: 500,
				},
			);
		} finally {
			// release
			await this.semaphoreAtom.conditionallyUpdate(
				() => true,
				(seats) => seats + 1,
			);
		}
	}
}

export class JonogonRenderingImageAccessor extends DurableObject {
	public lockAtom = atom(false /* is_locked */);

	constructor(
		public ctx: DurableObjectState,
		public env: Env,
	) {
		super(ctx, env);
	}

	async getImage(
		config: {
			url: string;
			w: number;
			h: number;
		},
		key: string,
	): Promise<Response> {
		// acquire
		await this.lockAtom.conditionallyUpdate(
			(isLocked) => isLocked === false,
			() => true,
		);

		try {
			const imagePath = `page_preview_${key}.png`;
			const storedImage = await this.env.STATIC_R2.get(imagePath);

			if (storedImage) {
				return new Response(storedImage.body, {
					headers: {
						'Content-Type': 'image/png',
					},
				});
			}

			const id = this.env.RENDERING_DO.idFromName(key);
			const rendering = this.env.RENDERING_DO.get(id);

			const captureResponse: Response = await rendering.capture(config);

			if (!captureResponse.ok) {
				return captureResponse;
			}

			await this.env.STATIC_R2.put(imagePath, captureResponse.body);
			const createdImage = await this.env.STATIC_R2.get(imagePath);

			if (createdImage) {
				return new Response(createdImage.body, {
					headers: {
						'Content-Type': 'image/png',
					},
				});
			}

			return Response.json(
				{
					message: 'the image could not be captured',
				},
				{
					status: 500,
				},
			);
		} catch {
			return Response.json(
				{
					message: 'something went wrong on the capturing service',
				},
				{
					status: 500,
				},
			);
		} finally {
			// release
			await this.lockAtom.conditionallyUpdate(
				() => true,
				() => false,
			);
		}
	}
}

const encoder = new TextEncoder();

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		const captureConfig = z
			.object({
				url: z.string().url(),
				key: z.string(),
				w: z.string().transform(Number),
				h: z.string().transform(Number),
			})
			.and(z.union([z.object({ sign: z.string() }), z.object({ api_key: z.string() })]))
			.safeParse({
				url: url.searchParams.get('url'),
				key: url.searchParams.get('key'),
				w: url.searchParams.get('w'),
				h: url.searchParams.get('h'),
				sign: url.searchParams.get('sign'),
				api_key: url.searchParams.get('api_key'),
			});

		if (!captureConfig.success) {
			return Response.json(
				{
					error: captureConfig.error,
				},
				{
					status: 400,
				},
			);
		}

		const durableObjectKeyString = `${captureConfig.data.url};${captureConfig.data.key};${captureConfig.data.w};${captureConfig.data.h}`;
		const encodedDurableObjectKeyString = encoder.encode(durableObjectKeyString);

		if ('api_key' in captureConfig.data) {
			const verified = captureConfig.data.api_key === env.SYMMETRIC_KEY;

			if (!verified) {
				return Response.json(
					{
						message: 'invalid api_key',
					},
					{
						status: 401,
					},
				);
			}
		} else {
			const encodedSymmetricKeyString = encoder.encode(env.SYMMETRIC_KEY);

			const signatureData = Buffer.from(captureConfig.data.sign, 'base64');
			const signingKey = await crypto.subtle.importKey('raw', encodedSymmetricKeyString, { name: 'HMAC', hash: 'SHA-256' }, false, [
				'verify',
			]);

			const verified = await crypto.subtle.verify('HMAC', signingKey, signatureData, encoder.encode(durableObjectKeyString));

			if (!verified) {
				return Response.json(
					{
						message: 'bad signature',
					},
					{
						status: 401,
					},
				);
			}
		}

		const durableObjectKeyStringDigest = await crypto.subtle.digest(
			{
				name: 'SHA-256',
			},
			encodedDurableObjectKeyString,
		);

		const durableObjectKeyStringDigestHex = [...new Uint8Array(durableObjectKeyStringDigest)]
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

		const id: DurableObjectId = env.IMAGE_ACCESSOR.idFromName(durableObjectKeyStringDigestHex);
		const durableObject = env.IMAGE_ACCESSOR.get(id);

		return await durableObject.getImage(captureConfig.data, durableObjectKeyStringDigestHex);
	},
} satisfies ExportedHandler<Env>;
