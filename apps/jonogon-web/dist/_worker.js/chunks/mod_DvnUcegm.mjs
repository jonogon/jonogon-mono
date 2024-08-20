globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as trpc, j as jsxDevRuntimeExports, L as Link } from './_.._lpd1uu63.mjs';

function ModPage() {
  const { data: pendingPetitionRequestResponse } = trpc.petitions.listPendingPetitionRequests.useQuery({ page: 0 });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-screen-sm mx-auto py-16 px-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-3xl font-regular text-stone-600 leading-0", children: "Petition Requests That Need Moderation" }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/mod.tsx",
      lineNumber: 10,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: pendingPetitionRequestResponse?.data.map((petition, i) => {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Link,
        {
          href: `/petitions/${petition.id}`,
          className: "block text-xl font-medium py-4 underline",
          children: [
            "[",
            i + 1,
            ']: "',
            petition.title,
            '" - ',
            petition.name
          ]
        },
        petition.id,
        true,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/mod.tsx",
          lineNumber: 16,
          columnNumber: 25
        },
        this
      );
    }) ?? [] }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/mod.tsx",
      lineNumber: 13,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/mod.tsx",
    lineNumber: 9,
    columnNumber: 9
  }, this);
}

export { ModPage as default };
