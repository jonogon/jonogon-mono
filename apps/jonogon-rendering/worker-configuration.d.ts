// Generated by Wrangler on Sat Nov 02 2024 06:16:10 GMT+0000 (Coordinated Universal Time)
// by running `wrangler types`

interface Env {
	SYMMETRIC_KEY: string;
	RENDERING_DO: DurableObjectNamespace<import("./src/index").JonogonRenderingDurableObject>;
	IMAGE_ACCESSOR: DurableObjectNamespace<import("./src/index").JonogonRenderingImageAccessor>;
	STATIC_R2: R2Bucket;
	BROWSER: Fetcher;
}
