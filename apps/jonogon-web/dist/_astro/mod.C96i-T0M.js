import{t,j as s,L as a}from"./App.CSUcjDxE.js";import"./index.CC7gbGQC.js";/* empty css                        */function p(){const{data:o}=t.petitions.listPendingPetitionRequests.useQuery({page:0});return s.jsxDEV("div",{className:"max-w-screen-sm mx-auto py-16 px-4",children:[s.jsxDEV("h1",{className:"text-3xl font-regular text-stone-600 leading-0",children:"Petition Requests That Need Moderation"},void 0,!1,{fileName:"/mono/apps/jonogon-web/src/app/pages/mod.tsx",lineNumber:10,columnNumber:13},this),s.jsxDEV("div",{children:o?.data.map((e,n)=>s.jsxDEV(a,{href:`/petitions/${e.id}`,className:"block text-xl font-medium py-4 underline",children:["[",n+1,']: "',e.title,'" - ',e.name]},e.id,!0,{fileName:"/mono/apps/jonogon-web/src/app/pages/mod.tsx",lineNumber:16,columnNumber:25},this))??[]},void 0,!1,{fileName:"/mono/apps/jonogon-web/src/app/pages/mod.tsx",lineNumber:13,columnNumber:13},this)]},void 0,!0,{fileName:"/mono/apps/jonogon-web/src/app/pages/mod.tsx",lineNumber:9,columnNumber:9},this)}export{p as default};