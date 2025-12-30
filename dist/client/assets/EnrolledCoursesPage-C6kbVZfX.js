import{j as e,K as m,L as j,a as y,C as f}from"./index-BlaCQYdb.js";const N=({title:i,description:r,actionButtons:s=[],className:l="",variant:t="default",icon:x,badge:c,image:h,footer:g,stats:d,gradientFrom:b="from-blue-500",gradientTo:p="to-purple-600",hoverEffect:u=!0})=>{const v={default:"bg-white border border-gray-200 shadow-lg",gradient:`bg-gradient-to-br ${b} ${p} text-white`,glass:"bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",minimal:"bg-transparent border-2 border-gray-300 shadow-sm",elevated:"bg-white border border-gray-100 shadow-2xl"},w={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.4}},hover:u?{scale:1.03,y:-5,transition:{duration:.2}}:{},tap:{scale:.98}},a=t==="gradient"||t==="glass";return e.jsxs(m.div,{className:`
        rounded-2xl p-6 flex flex-col justify-between 
        transition-all duration-300 relative overflow-hidden
        group cursor-pointer
        ${v[t]} ${l}
      `,variants:w,initial:"hidden",animate:"visible",whileHover:"hover",whileTap:"tap",children:[(t==="minimal"||t==="default")&&e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"}),c&&e.jsx("div",{className:`
          absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold
          ${a?"bg-white/20 text-white backdrop-blur-sm":"bg-gradient-to-r from-blue-500 to-purple-500 text-white"}
        `,children:c}),h&&e.jsx("div",{className:"w-16 h-16 rounded-xl mb-4 overflow-hidden shadow-md",children:e.jsx("img",{src:h,alt:i,className:"w-full h-full object-cover"})}),e.jsxs("div",{className:"flex-1 relative z-10",children:[e.jsxs("div",{className:"flex items-start gap-3 mb-3",children:[x&&e.jsx("div",{className:`
              p-2 rounded-lg flex-shrink-0
              ${a?"bg-white/20 text-white":"bg-blue-50 text-blue-600"}
            `,children:x}),e.jsx("div",{className:"flex-1",children:e.jsx("h2",{className:`
              text-xl font-bold leading-tight
              ${a?"text-white":"text-gray-800"}
            `,children:i})})]}),r&&e.jsx("p",{className:`
            text-sm leading-relaxed mt-2
            ${a?"text-white/80":"text-gray-600"}
          `,children:r}),d&&d.length>0&&e.jsx("div",{className:"flex gap-4 mt-4 pt-4 border-t border-gray-200/50",children:d.map((o,n)=>e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:`
                  text-lg font-bold
                  ${a?"text-white":"text-gray-800"}
                `,children:o.value}),e.jsx("div",{className:`
                  text-xs
                  ${a?"text-white/70":"text-gray-500"}
                `,children:o.label})]},n))})]}),s.length>0&&e.jsx("div",{className:`
          flex flex-wrap gap-2 mt-4 pt-4 relative z-10
          ${d||r?"border-t border-gray-200/50":""}
        `,children:s.map((o,n)=>e.jsx(m.div,{className:"flex-1 min-w-[120px]",whileHover:{scale:1.02},whileTap:{scale:.98},children:o},n))}),g&&e.jsx("div",{className:`
          mt-4 pt-4 border-t text-xs
          ${a?"text-white/60 border-white/20":"text-gray-500 border-gray-200"}
        `,children:g}),e.jsx("div",{className:`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 pointer-events-none
        ${t==="gradient"?"bg-white/5":t==="glass"?"bg-white/10":"bg-black/5"}
      `})]})},k=()=>{const i=j(),r=y(),s=i.state?.enrolledCourses||[];return e.jsxs("div",{className:"p-6 max-w-7xl mx-auto",children:[e.jsx("button",{onClick:()=>r(-1),className:"mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition",children:"← Back"}),e.jsxs("h1",{className:"text-3xl font-bold mb-6",children:["Enrolled ",f]}),s.length===0?e.jsx("p",{className:"text-gray-500",children:"No Training enrolled."}):e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",children:s.map((l,t)=>e.jsx(N,{title:l.title||l,variant:"elevated",badge:l.tag},t))})]})};export{k as default};
