globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createLucideIcon, j as jsxDevRuntimeExports, B as Button, a as cn, t as trpc, k as useTokenManager, d as useLocation, m as toast } from './_.._lpd1uu63.mjs';
import { I as Input } from './input_A3p9nxXj.mjs';
import { L as Label } from './label_Dn7CH0NB.mjs';
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';
import { u as useQueryParams } from './useQueryParams_rjFEq_Ay.mjs';

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Dot = createLucideIcon("Dot", [
  ["circle", { cx: "12.1", cy: "12.1", r: "1", key: "18d7e5" }]
]);

function NumberStage({
  number,
  onNumberChange,
  onNext,
  isLoading
}) {
  const isNumberValid = /^01[0-9]{9}$/g.test(number);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col space-y-2", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "phone", className: "w-full", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-lg font-bold", children: "Phone Number" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
        lineNumber: 24,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-base text-neutral-500", children: "আপনার ফোন নাম্বারটি লিখুন" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
        lineNumber: 25,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
      lineNumber: 23,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Input,
      {
        id: "phone",
        className: "text-2xl py-6 px-4 bg-white",
        placeholder: "01xxxxxxxxx",
        value: number,
        onChange: onNumberChange,
        autoFocus: true,
        type: "text",
        pattern: "[0-9]*",
        inputMode: "numeric"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
        lineNumber: 29,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Button,
      {
        className: "w-full",
        size: "lg",
        onClick: onNext,
        disabled: !isNumberValid || isLoading,
        children: "Next"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
        lineNumber: 40,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/components/custom/NumberStage.tsx",
    lineNumber: 22,
    columnNumber: 9
  }, this);
}

var Wt=Object.defineProperty,Bt=Object.defineProperties;var At=Object.getOwnPropertyDescriptors;var U=Object.getOwnPropertySymbols;var Rt=Object.prototype.hasOwnProperty,vt=Object.prototype.propertyIsEnumerable;var pt=(r,s,e)=>s in r?Wt(r,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[s]=e,gt=(r,s)=>{for(var e in s||(s={}))Rt.call(s,e)&&pt(r,e,s[e]);if(U)for(var e of U(s))vt.call(s,e)&&pt(r,e,s[e]);return r},Et=(r,s)=>Bt(r,At(s));var St=(r,s)=>{var e={};for(var u in r)Rt.call(r,u)&&s.indexOf(u)<0&&(e[u]=r[u]);if(r!=null&&U)for(var u of U(r))s.indexOf(u)<0&&vt.call(r,u)&&(e[u]=r[u]);return e};var bt="^\\d+$";function Pt(r){let s=setTimeout(r,0),e=setTimeout(r,10),u=setTimeout(r,50);return [s,e,u]}function ht(r){let s=reactExports.useRef();return reactExports.useEffect(()=>{s.current=r;}),s.current}var kt=18,_t=40,Ot=`${_t}px`,Gt=["[data-lastpass-icon-root]","com-1password-button","[data-dashlanecreated]",'[style$="2147483647 !important;"]'].join(",");function wt({containerRef:r,inputRef:s,pushPasswordManagerStrategy:e,isFocused:u}){let h=reactExports.useRef({done:!1,refocused:!1}),[W,B]=reactExports.useState(!1),[z,q]=reactExports.useState(!1),[j,A]=reactExports.useState(!1),V=reactExports.useMemo(()=>e==="none"?!1:(e==="increase-width"||e==="experimental-no-flickering")&&W&&z,[W,z,e]),c=reactExports.useCallback(()=>{let v=r.current,m=s.current;if(!v||!m||j||e==="none")return;let g=v,k=g.getBoundingClientRect().left+g.offsetWidth,M=g.getBoundingClientRect().top+g.offsetHeight/2,a=k-kt,b=M;if(!(document.querySelectorAll(Gt).length===0&&document.elementFromPoint(a,b)===v)&&(B(!0),A(!0),!h.current.refocused&&document.activeElement===m)){let d=[m.selectionStart,m.selectionEnd];m.blur(),m.focus(),m.setSelectionRange(d[0],d[1]),h.current.refocused=!0;}},[r,s,j,e]);return reactExports.useEffect(()=>{let v=r.current;if(!v||e==="none")return;function m(){let M=window.innerWidth-v.getBoundingClientRect().right;q(M>=_t);}m();let g=setInterval(m,1e3);return ()=>{clearInterval(g);}},[r,e]),reactExports.useEffect(()=>{let v=u||document.activeElement===s.current;if(e==="none"||!v)return;let m=setTimeout(c,0),g=setTimeout(c,2e3),k=setTimeout(c,5e3),M=setTimeout(()=>{A(!0);},6e3);return ()=>{clearTimeout(m),clearTimeout(g),clearTimeout(k),clearTimeout(M);}},[s,u,e,c]),{hasPWMBadge:W,willPushPWMBadge:V,PWM_BADGE_SPACE_WIDTH:Ot}}var xt=reactExports.createContext({}),jt=reactExports.forwardRef((m,v)=>{var g=m,{value:r,onChange:s,maxLength:e,textAlign:u="left",pattern:h=bt,inputMode:W="numeric",onComplete:B,pushPasswordManagerStrategy:z="increase-width",containerClassName:q,noScriptCSSFallback:j=Lt,render:A,children:V}=g,c=St(g,["value","onChange","maxLength","textAlign","pattern","inputMode","onComplete","pushPasswordManagerStrategy","containerClassName","noScriptCSSFallback","render","children"]);var Y,it,lt,ut,dt;let[k,M]=reactExports.useState(typeof c.defaultValue=="string"?c.defaultValue:""),a=r!=null?r:k,b=ht(a),O=reactExports.useCallback(t=>{s==null||s(t),M(t);},[s]),d=reactExports.useMemo(()=>h?typeof h=="string"?new RegExp(h):h:null,[h]),i=reactExports.useRef(null),K=reactExports.useRef(null),J=reactExports.useRef({value:a,onChange:O,isIOS:typeof window!="undefined"&&((it=(Y=window==null?void 0:window.CSS)==null?void 0:Y.supports)==null?void 0:it.call(Y,"-webkit-touch-callout","none"))}),X=reactExports.useRef({prev:[(lt=i.current)==null?void 0:lt.selectionStart,(ut=i.current)==null?void 0:ut.selectionEnd,(dt=i.current)==null?void 0:dt.selectionDirection]});reactExports.useImperativeHandle(v,()=>i.current,[]),reactExports.useEffect(()=>{let t=i.current,o=K.current;if(!t||!o)return;J.current.value!==t.value&&J.current.onChange(t.value),X.current.prev=[t.selectionStart,t.selectionEnd,t.selectionDirection];function f(){if(document.activeElement!==t){N(null),$(null);return}let l=t.selectionStart,S=t.selectionEnd,w=t.selectionDirection,y=t.maxLength,D=t.value,P=X.current.prev,E=-1,T=-1,I;if(D.length!==0&&l!==null&&S!==null){let yt=l===S,Dt=l===D.length&&D.length<y;if(yt&&!Dt){let H=l;if(H===0)E=0,T=1,I="forward";else if(H===y)E=H-1,T=H,I="backward";else if(y>1&&D.length>1){let et=0;if(P[0]!==null&&P[1]!==null){I=H<P[1]?"backward":"forward";let Ht=P[0]===P[1]&&P[0]<y;I==="backward"&&!Ht&&(et=-1);}E=et+H,T=et+H+1;}}E!==-1&&T!==-1&&E!==T&&i.current.setSelectionRange(E,T,I);}let ft=E!==-1?E:l,mt=T!==-1?T:S,Ct=I!=null?I:w;N(ft),$(mt),X.current.prev=[ft,mt,Ct];}if(document.addEventListener("selectionchange",f,{capture:!0}),f(),document.activeElement===t&&Q(!0),!document.getElementById("input-otp-style")){let l=document.createElement("style");if(l.id="input-otp-style",document.head.appendChild(l),l.sheet){let S="background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";F(l.sheet,"[data-input-otp]::selection { background: transparent !important; color: transparent !important; }"),F(l.sheet,`[data-input-otp]:autofill { ${S} }`),F(l.sheet,`[data-input-otp]:-webkit-autofill { ${S} }`),F(l.sheet,"@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }"),F(l.sheet,"[data-input-otp] + * { pointer-events: all !important; }");}}let p=()=>{o&&o.style.setProperty("--root-height",`${t.clientHeight}px`);};p();let _=new ResizeObserver(p);return _.observe(t),()=>{document.removeEventListener("selectionchange",f,{capture:!0}),_.disconnect();}},[]);let[nt,ot]=reactExports.useState(!1),[L,Q]=reactExports.useState(!1),[C,N]=reactExports.useState(null),[G,$]=reactExports.useState(null);reactExports.useEffect(()=>{Pt(()=>{var p,_,l,S;(p=i.current)==null||p.dispatchEvent(new Event("input"));let t=(_=i.current)==null?void 0:_.selectionStart,o=(l=i.current)==null?void 0:l.selectionEnd,f=(S=i.current)==null?void 0:S.selectionDirection;t!==null&&o!==null&&(N(t),$(o),X.current.prev=[t,o,f]);});},[a,L]),reactExports.useEffect(()=>{b!==void 0&&a!==b&&b.length<e&&a.length===e&&(B==null||B(a));},[e,B,b,a]);let x=wt({containerRef:K,inputRef:i,pushPasswordManagerStrategy:z,isFocused:L}),rt=reactExports.useCallback(t=>{let o=t.currentTarget.value.slice(0,e);if(o.length>0&&d&&!d.test(o)){t.preventDefault();return}typeof b=="string"&&o.length<b.length&&document.dispatchEvent(new Event("selectionchange")),O(o);},[e,O,b,d]),st=reactExports.useCallback(()=>{var t;if(i.current){let o=Math.min(i.current.value.length,e-1),f=i.current.value.length;(t=i.current)==null||t.setSelectionRange(o,f),N(o),$(f);}Q(!0);},[e]),ct=reactExports.useCallback(t=>{var P,E;let o=i.current;if(!J.current.isIOS||!t.clipboardData||!o)return;let f=t.clipboardData.getData("text/plain");t.preventDefault();let p=(P=i.current)==null?void 0:P.selectionStart,_=(E=i.current)==null?void 0:E.selectionEnd,w=(p!==_?a.slice(0,p)+f+a.slice(_):a.slice(0,p)+f+a.slice(p)).slice(0,e);if(w.length>0&&d&&!d.test(w))return;o.value=w,O(w);let y=Math.min(w.length,e-1),D=w.length;o.setSelectionRange(y,D),N(y),$(D);},[e,O,d,a]),Tt=reactExports.useMemo(()=>({position:"relative",cursor:c.disabled?"default":"text",userSelect:"none",WebkitUserSelect:"none",pointerEvents:"none"}),[c.disabled]),at=reactExports.useMemo(()=>({position:"absolute",inset:0,width:x.willPushPWMBadge?`calc(100% + ${x.PWM_BADGE_SPACE_WIDTH})`:"100%",clipPath:x.willPushPWMBadge?`inset(0 ${x.PWM_BADGE_SPACE_WIDTH} 0 0)`:void 0,height:"100%",display:"flex",textAlign:u,opacity:"1",color:"transparent",pointerEvents:"all",background:"transparent",caretColor:"transparent",border:"0 solid transparent",outline:"0 solid transparent",boxShadow:"none",lineHeight:"1",letterSpacing:"-.5em",fontSize:"var(--root-height)",fontFamily:"monospace",fontVariantNumeric:"tabular-nums"}),[x.PWM_BADGE_SPACE_WIDTH,x.willPushPWMBadge,u]),It=reactExports.useMemo(()=>reactExports.createElement("input",Et(gt({autoComplete:c.autoComplete||"one-time-code"},c),{"data-input-otp":!0,"data-input-otp-mss":C,"data-input-otp-mse":G,inputMode:W,pattern:d==null?void 0:d.source,style:at,maxLength:e,value:a,ref:i,onPaste:t=>{var o;ct(t),(o=c.onPaste)==null||o.call(c,t);},onChange:rt,onMouseOver:t=>{var o;ot(!0),(o=c.onMouseOver)==null||o.call(c,t);},onMouseLeave:t=>{var o;ot(!1),(o=c.onMouseLeave)==null||o.call(c,t);},onFocus:t=>{var o;st(),(o=c.onFocus)==null||o.call(c,t);},onBlur:t=>{var o;Q(!1),(o=c.onBlur)==null||o.call(c,t);}})),[rt,st,ct,W,at,e,G,C,c,d==null?void 0:d.source,a]),tt=reactExports.useMemo(()=>({slots:Array.from({length:e}).map((t,o)=>{let f=L&&C!==null&&G!==null&&(C===G&&o===C||o>=C&&o<G),p=a[o]!==void 0?a[o]:null;return {char:p,isActive:f,hasFakeCaret:f&&p===null}}),isFocused:L,isHovering:!c.disabled&&nt}),[L,nt,e,G,C,c.disabled,a]),Mt=reactExports.useMemo(()=>A?A(tt):reactExports.createElement(xt.Provider,{value:tt},V),[V,tt,A]);return reactExports.createElement(reactExports.Fragment,null,j!==null&&reactExports.createElement("noscript",null,reactExports.createElement("style",null,j)),reactExports.createElement("div",{ref:K,"data-input-otp-container":!0,style:Tt,className:q},Mt,reactExports.createElement("div",{style:{position:"absolute",inset:0,pointerEvents:"none"}},It)))});jt.displayName="Input";function F(r,s){try{r.insertRule(s);}catch(e){console.error("input-otp could not insert CSS rule:",s);}}var Lt=`
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`;

const InputOTP = reactExports.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  jt,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
    lineNumber: 11,
    columnNumber: 5
  },
  undefined
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref, className: cn("flex items-center", className), ...props }, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
  lineNumber: 27,
  columnNumber: 5
}, undefined));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = reactExports.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = reactExports.useContext(xt);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
          lineNumber: 50,
          columnNumber: 21
        }, undefined) }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
          lineNumber: 49,
          columnNumber: 17
        }, undefined)
      ]
    },
    void 0,
    true,
    {
      fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
      lineNumber: 39,
      columnNumber: 9
    },
    undefined
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = reactExports.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dot, {}, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
  lineNumber: 63,
  columnNumber: 9
}, undefined) }, void 0, false, {
  fileName: "/mono/apps/jonogon-web/src/app/components/ui/input-otp.tsx",
  lineNumber: 62,
  columnNumber: 5
}, undefined));
InputOTPSeparator.displayName = "InputOTPSeparator";

function useRerenderInterval(interval = 1e3, predicate) {
  const intervalRef = reactExports.useRef(false);
  const [count, setCount] = reactExports.useState(0);
  const standardPredicate = predicate === true || predicate === false ? predicate : predicate instanceof Function ? predicate(count) : true;
  reactExports.useEffect(() => {
    if (standardPredicate) {
      intervalRef.current = setInterval(() => {
        setCount((pulse) => pulse + 1);
      }, interval);
    }
    return () => {
      if (!!intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [standardPredicate, setCount]);
  return [count, () => setCount(0)];
}

const OTP_RESEND_INTERVAL = 60;
const OtpResendSection = ({
  onOtpResendPress,
  isDisabled
}) => {
  const [count, resetCount] = useRerenderInterval(
    1e3,
    (count2) => count2 < OTP_RESEND_INTERVAL
  );
  const remainingTime = OTP_RESEND_INTERVAL - count;
  const remainingTimeStr = `${remainingTime} second${remainingTime > 1 ? "s" : ""}`;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col items-center gap-2", children: [
    remainingTime === 0 ? null : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-stone-500", children: [
      "OTP পাননি? Retry করতে পারবেন",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-red-600", children: [
        " ",
        remainingTimeStr,
        " "
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 42,
        columnNumber: 21
      }, undefined),
      "পরে"
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
      lineNumber: 40,
      columnNumber: 17
    }, undefined),
    remainingTime !== 0 ? null : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Button,
      {
        size: "sm",
        variant: "outline",
        disabled: isDisabled || remainingTime !== 0,
        onClick: () => {
          onOtpResendPress();
          resetCount();
        },
        children: "Resend OTP"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 47,
        columnNumber: 17
      },
      undefined
    )
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
    lineNumber: 38,
    columnNumber: 9
  }, undefined);
};
function OTPStage({
  number,
  otp,
  onOTPChange,
  onVerify,
  isLoading,
  onChangeNumPress,
  onOtpResendPress
}) {
  const handleOTPChange = (newValue) => {
    onOTPChange(newValue);
  };
  const isOTPValid = /^[0-9]{4}$/g.test(otp);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "otp", className: "w-full", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-lg font-bold", children: "Enter OTP" }, void 0, false, {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 80,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-base text-neutral-500", children: [
        "আপনার",
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-bold text-red-600", children: number }, void 0, false, {
          fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
          lineNumber: 83,
          columnNumber: 21
        }, this),
        " ",
        "নাম্বারে একটি ৪ সংখ্যাসর OTP পাঠানো হয়েছে, সেটি লিখুন",
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Button,
          {
            className: "text-red-600 h-6 px-2",
            variant: "link",
            onClick: onChangeNumPress,
            children: "Change Number"
          },
          void 0,
          false,
          {
            fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
            lineNumber: 85,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 81,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
      lineNumber: 79,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      InputOTP,
      {
        id: "otp",
        autoFocus: true,
        maxLength: 4,
        value: otp,
        onChange: handleOTPChange,
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(InputOTPGroup, { className: "w-full", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            InputOTPSlot,
            {
              index: 0,
              className: "w-full bg-white text-2xl h-16"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
              lineNumber: 100,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            InputOTPSlot,
            {
              index: 1,
              className: "w-full bg-white text-2xl h-16"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
              lineNumber: 104,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            InputOTPSlot,
            {
              index: 2,
              className: "w-full bg-white text-2xl h-16"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
              lineNumber: 108,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            InputOTPSlot,
            {
              index: 3,
              className: "w-full bg-white text-2xl h-16"
            },
            void 0,
            false,
            {
              fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
              lineNumber: 112,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
          lineNumber: 99,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 93,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Button,
      {
        className: "w-full",
        onClick: onVerify,
        disabled: !isOTPValid || isLoading,
        size: "lg",
        children: "Verify"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 118,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      OtpResendSection,
      {
        onOtpResendPress,
        isDisabled: isLoading
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
        lineNumber: 126,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/components/custom/OTPStage.tsx",
    lineNumber: 78,
    columnNumber: 9
  }, this);
}

function Index() {
  const [number, setNumber] = reactExports.useState(
    "01111111111" 
  );
  const [otp, setOTP] = reactExports.useState("1111" );
  const [stage, setStage] = reactExports.useState("number");
  const {
    mutate: requestOTP,
    isLoading: isRequestLoading,
    error: otpRequestError
  } = trpc.auth.requestOTP.useMutation();
  const { mutate: createToken, isLoading: isTokenLoading } = trpc.auth.createToken.useMutation();
  const updateNumber = reactExports.useCallback(
    (ev) => {
      setNumber(ev.target.value.replace(/[^[0-9]/g, "").substring(0, 11));
    },
    [setNumber]
  );
  const updateOTP = reactExports.useCallback(
    (newValue) => {
      setOTP(newValue.replace(/[^[0-9]/g, "").substring(0, 4));
    },
    [setOTP]
  );
  const sendOTPRequest = () => {
    requestOTP(
      {
        phoneNumber: `+88${number}`
      },
      {
        onSuccess: () => {
          setStage("otp");
        }
      }
    );
  };
  const { set: setTokens } = useTokenManager();
  const [, setLocation] = useLocation();
  const [params] = useQueryParams();
  const redirectUrl = params.next[0] || "/";
  const login = () => {
    createToken(
      {
        phoneNumber: `+88${number}`,
        otp
      },
      {
        onSuccess: async (data) => {
          await setTokens({
            accessToken: data.access_token,
            accessTokenValidity: data.access_token_validity * 1e3,
            refreshToken: data.refresh_token,
            refreshTokenValidity: data.refresh_token_validity * 1e3
          });
          setLocation(redirectUrl);
        }
      }
    );
  };
  const onChangeNumPress = () => {
    setStage("number");
  };
  reactExports.useEffect(() => {
    if (otpRequestError) {
      toast({
        title: "Otp Request Error",
        description: otpRequestError.message
      });
    }
  }, [otpRequestError]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-screen-sm mx-auto px-4 flex flex-col justify-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "h1",
      {
        className: "text-3xl py-12 md:py-20 font-regular text-stone-600 leading-0",
        children: "জনগণের প্লাটফর্মে Login করুন 🇧🇩"
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/login.tsx",
        lineNumber: 97,
        columnNumber: 13
      },
      this
    ),
    stage === "number" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      NumberStage,
      {
        number,
        onNumberChange: updateNumber,
        onNext: sendOTPRequest,
        isLoading: isRequestLoading
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/login.tsx",
        lineNumber: 104,
        columnNumber: 17
      },
      this
    ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      OTPStage,
      {
        number,
        otp,
        onOTPChange: updateOTP,
        onVerify: login,
        onChangeNumPress,
        onOtpResendPress: sendOTPRequest,
        isLoading: isTokenLoading
      },
      void 0,
      false,
      {
        fileName: "/mono/apps/jonogon-web/src/app/pages/login.tsx",
        lineNumber: 111,
        columnNumber: 17
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/mono/apps/jonogon-web/src/app/pages/login.tsx",
    lineNumber: 96,
    columnNumber: 9
  }, this);
}

export { Index as default };
