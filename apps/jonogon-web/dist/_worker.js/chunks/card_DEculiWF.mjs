globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createLucideIcon, j as jsxDevRuntimeExports, a as cn } from './_.._lpd1uu63.mjs';
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ThumbsDown = createLucideIcon("ThumbsDown", [
  ["path", { d: "M17 14V2", key: "8ymqnk" }],
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ]
]);

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ThumbsUp = createLucideIcon("ThumbsUp", [
  ["path", { d: "M7 10v12", key: "1qc93n" }],
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ]
]);

const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
    lineNumber: 9,
    columnNumber: 5
  },
  undefined
));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
    lineNumber: 24,
    columnNumber: 5
  },
  undefined
));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
    lineNumber: 36,
    columnNumber: 5
  },
  undefined
));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
    lineNumber: 51,
    columnNumber: 5
  },
  undefined
));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref, className: cn("p-6 pt-0", className), ...props }, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
  lineNumber: 63,
  columnNumber: 5
}, undefined));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/card.tsx",
    lineNumber: 71,
    columnNumber: 5
  },
  undefined
));
CardFooter.displayName = "CardFooter";

export { Card as C, ThumbsUp as T, CardHeader as a, CardTitle as b, CardFooter as c, ThumbsDown as d, CardContent as e };
