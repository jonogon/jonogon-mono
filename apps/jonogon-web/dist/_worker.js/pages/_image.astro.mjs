globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../chunks/_@astro-renderers_Dy_ij9pO.mjs';

const prerender = false;
const GET = (ctx) => {
    const href = ctx.url.searchParams.get('href');
    if (!href) {
        return new Response("Missing 'href' query parameter", {
            status: 400,
            statusText: "Missing 'href' query parameter",
        });
    }
    return fetch(new URL(href, ctx.url.origin));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
