globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as trpc, k as useTokenManager, l as useMutation, d as useLocation, j as jsxDevRuntimeExports, a as cn, B as Button } from './_.._lpd1uu63.mjs';
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';
import { I as Input } from './input_A3p9nxXj.mjs';

function ProfileUpdate() {
  const utils = trpc.useUtils();
  const { data: selfDataResponse } = trpc.users.getSelf.useQuery(void 0);
  const pictureURL = selfDataResponse?.data.picture_url ? selfDataResponse?.data.picture_url.replace(
    "$CORE_HOSTNAME",
    window.location.hostname
  ) : null;
  const [name, setName] = reactExports.useState(null);
  const { get: getToken } = useTokenManager();
  const resolvedName = name ?? selfDataResponse?.data.name ?? "";
  const updateName = reactExports.useCallback(
    (ev) => {
      setName(ev.target.value.trimStart().replace(/\s+/g, " "));
    },
    [setName]
  );
  const valid = resolvedName.split(" ").map((c) => c.trim()).filter((c) => c.length >= 2).length >= 2;
  const { mutate: uploadPhoto, isLoading: isPictureLoading } = useMutation({
    mutationFn: async (data) => {
      await fetch(
        `http://${window.location.hostname}:12001/users/self/picture` ,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${await getToken()}`
          },
          body: data.file
        }
      );
    },
    onSuccess: async () => {
      await utils.users.getSelf.invalidate();
      window.document.getElementById("name")?.focus?.();
    }
  });
  const [, setLocation] = useLocation();
  const { mutate: save, isLoading: isSaveLoading } = trpc.users.updateSelf.useMutation({
    onSuccess: async () => {
      await utils.users.getSelf.invalidate();
      setLocation("/");
    }
  });
  const triggerSave = () => {
    save({
      name: resolvedName.trim()
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-screen-sm mx-auto px-4 flex flex-col justify-center space-y-6", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "h1",
      {
        className: "text-4xl py-16 md:py-16 font-regular text-stone-600 leading-0",
        children: "🎭 আপনার Profile সম্পূর্ণ করুন"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
        lineNumber: 78,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "image", className: "cursor-pointer", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-bold text-lg", children: "Picture" }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 86,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-stone-600", children: "নিজের একটি ছবি upload করুন" }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 87,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
        lineNumber: 85,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: cn(
            "w-32 h-32 flex justify-center items-center rounded-full border-8 relative cursor-pointer bg-contain bg-center"
          ),
          style: pictureURL ? {
            backgroundImage: `url('${pictureURL}')`
          } : {},
          children: [
            isPictureLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "animate-spin border-4 border-b-transparent border-l-transparent border-red-500 w-8 h-8 rounded-full"
              },
              void 0,
              false,
              {
                fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
                lineNumber: 103,
                columnNumber: 25
              },
              this
            ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "span",
              {
                className: "text-5xl text-stone-400 drop-shadow-sm",
                children: "+"
              },
              void 0,
              false,
              {
                fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
                lineNumber: 108,
                columnNumber: 25
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "input",
              {
                id: "image",
                type: "file",
                className: "w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer",
                accept: "image/*",
                onChange: (ev) => {
                  if (ev.target.files?.length) {
                    uploadPhoto({ file: ev.target.files[0] });
                  }
                }
              },
              void 0,
              false,
              {
                fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
                lineNumber: 116,
                columnNumber: 21
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 91,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
      lineNumber: 84,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "name", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-bold text-lg", children: "Your Full Name" }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 133,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-stone-600", children: "আপনার নাম লিখুন" }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 134,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
        lineNumber: 132,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Input,
        {
          placeholder: "রাকিব আল হাসান",
          id: "name",
          className: "bg-white text-xl py-8",
          value: resolvedName,
          onChange: updateName
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
          lineNumber: 136,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
      lineNumber: 131,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Button,
      {
        size: "lg",
        disabled: !valid || isSaveLoading,
        className: "w-full md:w-2/4",
        onClick: triggerSave,
        children: "Complete — সম্পূর্ণ করুন"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
        lineNumber: 145,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
      lineNumber: 144,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/profile/update.tsx",
    lineNumber: 77,
    columnNumber: 9
  }, this);
}

export { ProfileUpdate as default };
