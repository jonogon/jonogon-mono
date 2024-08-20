globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createLucideIcon, G as GenIcon, j as jsxDevRuntimeExports, a as cn, b as buttonVariants, C as ChevronRight, u as useAuthState, d as useLocation, L as Link, B as Button, t as trpc, o as observer, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, g as DropdownMenuItem } from './_.._lpd1uu63.mjs';
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardFooter, T as ThumbsUp, d as ThumbsDown } from './card_DEculiWF.mjs';
import { u as useQueryParams } from './useQueryParams_rjFEq_Ay.mjs';

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);

// THIS FILE IS AUTO GENERATED
function RxCaretSort (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 15 15","fill":"none"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","clipRule":"evenodd","d":"M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z","fill":"currentColor"},"child":[]}]})(props);
}function RxCheck (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 15 15","fill":"none"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","clipRule":"evenodd","d":"M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z","fill":"currentColor"},"child":[]}]})(props);
}

const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
    lineNumber: 8,
    columnNumber: 5
  },
  undefined
);
Pagination.displayName = "Pagination";
const PaginationContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
    lineNumber: 21,
    columnNumber: 5
  },
  undefined
));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { ref, className: cn("", className), ...props }, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
  lineNumber: 33,
  columnNumber: 5
}, undefined));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "a",
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
    lineNumber: 48,
    columnNumber: 5
  },
  undefined
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronLeft, { className: "h-4 w-4" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
        lineNumber: 71,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Previous" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
        lineNumber: 72,
        columnNumber: 9
      }, undefined)
    ]
  },
  void 0,
  true,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
    lineNumber: 66,
    columnNumber: 5
  },
  undefined
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Next" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronRight, { className: "h-4 w-4" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
        lineNumber: 87,
        columnNumber: 9
      }, undefined)
    ]
  },
  void 0,
  true,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/pagination.tsx",
    lineNumber: 81,
    columnNumber: 5
  },
  undefined
);
PaginationNext.displayName = "PaginationNext";

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const getDaySuffix = (day2) => {
    if (day2 > 3 && day2 < 21) return "th";
    switch (day2 % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${day}${getDaySuffix(day)} ${month}, ${year}`;
};

function PetitionCard(props) {
  const isAuthenticated = useAuthState();
  const [, setLocation] = useLocation();
  const totalVotes = props.upvotes + props.downvotes;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "font-normal text-base text-neutral-500 pb-2",
          children: [
            props.name,
            ", ",
            formatDate(props.date),
            " — To,",
            " ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("i", { children: props.target }, void 0, false, {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
              lineNumber: 42,
              columnNumber: 25
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 37,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Link,
        {
          href: `/petitions/${props.id}`,
          className: "leading-snug font-bold font-serif text-2xl align-middle",
          children: props.title
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 45,
          columnNumber: 25
        },
        this
      ) }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
        lineNumber: 44,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 36,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 35,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardFooter, { className: "flex items-center justify-between", children: props.mode === "formalized" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-red-600", children: [
        totalVotes,
        " ",
        totalVotes !== 1 ? "votes" : "vote"
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
        lineNumber: 58,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: () => {
            const href = `/petitions/${props.id}`;
            isAuthenticated ? setLocation(href) : setLocation(
              `/login?next=${encodeURIComponent(href)}`
            );
          },
          children: "VOTE"
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 61,
          columnNumber: 25
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 57,
      columnNumber: 21
    }, this) : props.mode === "request" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            ThumbsUp,
            {
              className: "w-5 h-5 text-green-500"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
              lineNumber: 80,
              columnNumber: 33
            },
            this
          ),
          props.upvotes
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 79,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThumbsDown, { className: "w-5 h-5 text-red-500" }, void 0, false, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
            lineNumber: 86,
            columnNumber: 33
          }, this),
          props.downvotes
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 85,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
        lineNumber: 78,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: () => {
            const href = `/petitions/${props.id}`;
            isAuthenticated ? setLocation(href) : setLocation(
              `/login?next=${encodeURIComponent(href)}`
            );
          },
          children: "VOTE"
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 90,
          columnNumber: 25
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 77,
      columnNumber: 21
    }, this) : props.mode === "own" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            ThumbsUp,
            {
              className: "w-5 h-5 text-green-500"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
              lineNumber: 109,
              columnNumber: 33
            },
            this
          ),
          props.upvotes
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 108,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThumbsDown, { className: "w-5 h-5 text-red-500" }, void 0, false, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
            lineNumber: 115,
            columnNumber: 33
          }, this),
          props.downvotes
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
          lineNumber: 114,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
        lineNumber: 107,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        "STATUS: ",
        props.status
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
        lineNumber: 119,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 106,
      columnNumber: 21
    }, this) : null }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
      lineNumber: 55,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionCard.tsx",
    lineNumber: 34,
    columnNumber: 9
  }, this);
}

const PetitionList = () => {
  const [params, setParams] = useQueryParams();
  const type = `${params.type}` === "requests" ? "request" : `${params.type}` === "own" ? "own" : "formalized";
  const page = params.page.length ? Number(`${params.page}`) : 0;
  const { data: petitionRequestListResponse } = trpc.petitions.list.useQuery({
    filter: type,
    page,
    sort: `${params.sort}` === "latest" ? "time" : "votes"
  });
  const petitions = petitionRequestListResponse?.data ?? [];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "15px"
        },
        children: petitions.slice(0, 32).map((p) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            PetitionCard,
            {
              id: p.data.id,
              mode: type,
              status: p.data.status,
              name: p.extras.user.name ?? "",
              title: p.data.title ?? "Untitled Petition",
              date: new Date(p.data.submitted_at ?? "1970-01-01"),
              target: p.data.target ?? "Some Ministry",
              upvotes: Number(p.data.petition_upvote_count) ?? 0,
              downvotes: Number(p.data.petition_downvote_count) ?? 0
            },
            p.data.id ?? 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
              lineNumber: 48,
              columnNumber: 25
            },
            undefined
          );
        })
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
        lineNumber: 40,
        columnNumber: 13
      },
      undefined
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pagination, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaginationContent, { children: [
      page !== 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaginationItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        PaginationPrevious,
        {
          onClick: () => setParams((params2) => ({
            ...params2,
            page: [`${page - 1}`]
          }))
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
          lineNumber: 70,
          columnNumber: 33
        },
        undefined
      ) }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
        lineNumber: 69,
        columnNumber: 29
      }, undefined) : null,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaginationItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaginationLink, { children: [
        "Page ",
        page + 1
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
        lineNumber: 82,
        columnNumber: 29
      }, undefined) }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
        lineNumber: 81,
        columnNumber: 25
      }, undefined),
      petitions.length === 33 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaginationItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        PaginationNext,
        {
          onClick: () => setParams((params2) => ({
            ...params2,
            page: [`${page + 1}`]
          }))
        },
        void 0,
        false,
        {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
          lineNumber: 87,
          columnNumber: 33
        },
        undefined
      ) }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
        lineNumber: 86,
        columnNumber: 29
      }, undefined) : null
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
      lineNumber: 67,
      columnNumber: 21
    }, undefined) }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
      lineNumber: 66,
      columnNumber: 17
    }, undefined) }, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
      lineNumber: 65,
      columnNumber: 13
    }, undefined)
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/home/components/PetitionList.tsx",
    lineNumber: 39,
    columnNumber: 9
  }, undefined);
};

const PetitionActionButton = observer(() => {
  const authState = useAuthState();
  const [, setLocation] = useLocation();
  const { mutate: createPetition } = trpc.petitions.create.useMutation({
    onSuccess(response) {
      setLocation(`/petitions/${response.data.id}/edit?fresh=true`);
    }
  });
  const handlePetitionCreate = async () => {
    if (!authState) {
      setLocation(`/login?next=${encodeURIComponent("/petitions/new")}`);
    } else {
      createPetition();
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    Button,
    {
      size: "lg",
      className: "bg-red-500 font-bold shadow-2xl drop-shadow-xl",
      onClick: handlePetitionCreate,
      children: !authState ? "Login to Submit a দাবি" : "Submit a দাবি"
    },
    void 0,
    false,
    {
      fileName: "/mono/apps/jonogon-web/src/app/components/custom/PetitionActionButton.tsx",
      lineNumber: 26,
      columnNumber: 9
    },
    undefined
  );
});

const FloatingButtonSection = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed bottom-0 left-0 w-full bg-background/50", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "div",
  {
    className: "max-w-screen-sm w-full mx-auto flex flex-col py-4 px-8",
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PetitionActionButton, {}, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
      lineNumber: 26,
      columnNumber: 13
    }, undefined)
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
    lineNumber: 22,
    columnNumber: 9
  },
  undefined
) }, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
  lineNumber: 21,
  columnNumber: 5
}, undefined);
function Tab({
  type,
  children
}) {
  const [params, setParams] = useQueryParams();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "button",
    {
      className: cn(
        "border-b-2 border-transparent px-3 pb-1 capitalize select-none",
        {
          "border-black": (`${params.type}` || "formalized") === type
        }
      ),
      onClick: () => setParams((params2) => ({ ...params2, type: [type] })),
      children
    },
    void 0,
    false,
    {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
      lineNumber: 40,
      columnNumber: 9
    },
    this
  );
}
function SortOption({
  sort,
  children
}) {
  const [params, setParams] = useQueryParams();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    DropdownMenuItem,
    {
      className: "capitalize flex items-center justify-between",
      onSelect: () => setParams((params2) => ({ ...params2, sort: [sort] })),
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
          lineNumber: 65,
          columnNumber: 13
        }, this),
        (`${params.sort}` || "votes") === sort ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RxCheck, {}, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
          lineNumber: 66,
          columnNumber: 55
        }, this) : null
      ]
    },
    void 0,
    true,
    {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
      lineNumber: 62,
      columnNumber: 9
    },
    this
  );
}
const Home = observer(() => {
  const [params] = useQueryParams();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-4 max-w-screen-sm mx-auto pb-16 px-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-12 my-5 text-3xl md:text-4xl", children: `${params.type}` === "own" ? "Your Own দাবিs" : "জনগণের দাবি" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
        lineNumber: 80,
        columnNumber: 17
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between my-2", children: [
        `${params.type}` === "own" ? null : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tab, { type: "formalized", children: "Formalized দাবিs" }, void 0, false, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
            lineNumber: 88,
            columnNumber: 29
          }, undefined),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tab, { type: "requests", children: "সব দাবি" }, void 0, false, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
            lineNumber: 89,
            columnNumber: 29
          }, undefined)
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
          lineNumber: 87,
          columnNumber: 25
        }, undefined),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenu, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuTrigger, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { className: "flex items-center gap-2 pb-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "capitalize text-sm select-none", children: `${params.sort}` === "latest" ? "Latest" : "বেশি Votes" }, void 0, false, {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
              lineNumber: 95,
              columnNumber: 33
            }, undefined),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RxCaretSort, {}, void 0, false, {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
              lineNumber: 100,
              columnNumber: 33
            }, undefined)
          ] }, void 0, true, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
            lineNumber: 94,
            columnNumber: 29
          }, undefined) }, void 0, false, {
            fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
            lineNumber: 93,
            columnNumber: 25
          }, undefined),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            DropdownMenuContent,
            {
              align: "end",
              onCloseAutoFocus: (e) => e.preventDefault(),
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SortOption, { sort: "votes", children: "বেশি Votes" }, void 0, false, {
                  fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
                  lineNumber: 106,
                  columnNumber: 29
                }, undefined),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SortOption, { sort: "latest", children: "Latest" }, void 0, false, {
                  fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
                  lineNumber: 107,
                  columnNumber: 29
                }, undefined)
              ]
            },
            void 0,
            true,
            {
              fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
              lineNumber: 103,
              columnNumber: 25
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
          lineNumber: 92,
          columnNumber: 21
        }, undefined)
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
        lineNumber: 85,
        columnNumber: 17
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PetitionList, {}, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
        lineNumber: 111,
        columnNumber: 17
      }, undefined)
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
      lineNumber: 79,
      columnNumber: 13
    }, undefined),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FloatingButtonSection, {}, void 0, false, {
      fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
      lineNumber: 113,
      columnNumber: 13
    }, undefined)
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/home/index.tsx",
    lineNumber: 78,
    columnNumber: 9
  }, undefined);
});

export { Home as default };
