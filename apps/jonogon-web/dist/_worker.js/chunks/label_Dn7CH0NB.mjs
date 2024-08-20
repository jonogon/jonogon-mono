globalThis.process ??= {}; globalThis.process.env ??= {};
import { h as jsxRuntimeExports, P as Primitive, j as jsxDevRuntimeExports, a as cn, n as cva } from './_.._lpd1uu63.mjs';
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';

var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;

const labelVariants = cva(
  "text-sm text-neutral-900 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/label.tsx",
    lineNumber: 16,
    columnNumber: 5
  },
  undefined
));
Label.displayName = Root.displayName;

export { Label as L };
