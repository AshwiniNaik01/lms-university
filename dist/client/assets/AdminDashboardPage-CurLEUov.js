import{j as e,C as s,aJ as o,b0 as t,b1 as d,b2 as i,b3 as c,b4 as r,b5 as m,b6 as g}from"./index-BlaCQYdb.js";import{H as l}from"./index-B3h-wylh.js";const x=[{title:"Batch Management",desc:"Add new batches, update existing ones, and manage study material structure.",link:"/manage-batches",icon:e.jsx(t,{})},{title:`${s} Management`,desc:`Add new ${s}, update existing ones, and manage curriculum structure.`,link:"/manage-courses",icon:e.jsx(t,{})},{title:"Participant Management",desc:"View all participate enrollments, track progress, and manage participate data.",link:"/enrolled-student-list",icon:e.jsx(d,{})},{title:"Trainer Management",desc:"Manage trainer profiles, assignments, and performance tracking.",link:"/trainer-management",icon:e.jsx(l,{})},{title:"Pre requisite Learning",desc:"Manage trainer profiles, assignments, and performance tracking.",link:"/manage-prerequisite",icon:e.jsx(l,{})},{title:"Assessment Tests",desc:"Create, manage, and evaluate assessment tests and quizzes.",link:"/manage-test",icon:e.jsx(i,{})},{title:"Reference Materials Repository",desc:"Create, manage, and evaluate reference materials.",link:"/manage-notes",icon:e.jsx(i,{})},{title:"Attendance Tracker",desc:"Monitor and manage participate attendance across all sessions.",link:"/manage-meeting",icon:e.jsx(c,{})},{title:"Assignment Management",desc:"Create assignments, track submissions, and provide feedback.",link:"/manage-assignments",icon:e.jsx(r,{})},{title:"Feedback Management",desc:"Create assignments, track submissions, and provide feedback.",link:"/manage-feedback",icon:e.jsx(r,{})},{title:"Book Session - Upskilling",desc:"Schedule and manage upskilling sessions for participates or staff.",link:"/book-session",icon:e.jsx(m,{})},{title:"User Management",desc:"View, edit, and manage all users with role-based access control.",link:"/users",icon:e.jsx(g,{})}],h=()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 p-6",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsx("header",{className:"mb-12 text-center",children:e.jsxs("div",{className:"mb-4",children:[e.jsx("h1",{className:"text-3xl lg:text-4xl font-bold text-gray-900 mb-3",children:"Admin Dashboard"}),e.jsxs("p",{className:"text-gray-600 text-lg max-w-2xl mx-auto",children:["Centralized platform to manage all aspects of your ",s]})]})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",children:x.map((a,n)=>e.jsxs("div",{className:`\r
        bg-white \r
        rounded-3xl \r
        p-8 \r
        shadow-lg \r
        hover:shadow-2xl \r
        transition-all \r
        duration-500 \r
        transform \r
        hover:scale-[1.04] \r
        ease-in-out \r
        cursor-pointer \r
        group\r
      `,style:{animationDelay:`${n*100}ms`},"data-aos":"fade-up",children:[e.jsxs("div",{className:"flex items-center gap-6 mb-6",children:[e.jsx("div",{className:`${a.iconBg} 
            rounded-2xl 
            p-5 
            shadow-md 
            text-4xl 
            flex items-center justify-center 
            transition-transform duration-300 
            group-hover:scale-110`,children:a.icon}),e.jsx("h3",{className:"text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300",children:a.title})]}),e.jsx("p",{className:"text-gray-600 mb-8 leading-relaxed text-[15px]",children:a.desc}),e.jsxs(o,{to:a.link,className:`\r
          inline-block \r
          px-6 py-3 \r
          bg-gradient-to-r from-indigo-600 to-purple-600 \r
          hover:from-indigo-700 hover:to-purple-700 \r
          text-white font-semibold \r
          rounded-lg \r
          shadow-lg \r
          transition duration-300 \r
          ease-in-out\r
        `,children:["View ",a.title]})]},n))})]})});export{h as default};
