// import { useEffect } from "react";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// export default function TestInstructions({ test }) {
//   const navigate = useNavigate();

//   useEffect(() => {
//     Swal.fire({
//       title: `Start ${test?.title}?`,
//       html: `
//         <div class="text-left max-h-[65vh] overflow-y-auto px-1">

//           <!-- Header -->
//           <div class="flex items-center mb-4">
//             <div class="bg-blue-100 p-2 rounded-full mr-3">
//               <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
//                   d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 class="text-xl font-bold text-gray-800">
//               Test Instructions
//             </h3>
//           </div>

//           <!-- General Instructions -->
//           <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
//             <h4 class="font-semibold text-blue-800 mb-2">
//               📌 General Guidelines
//             </h4>
//             <ul class="list-disc pl-5 space-y-2 text-blue-700 text-sm">
//               <li>Total duration: <b>${test?.testDuration?.minutes || "N/A"} minutes</b></li>
//               <li>Total questions: <b>${test?.totalQuestions}</b></li>
//               <li>Each question carries equal marks</li>
//               <li>No negative marking</li>
//             </ul>
//           </div>

//           <!-- During Test -->
//           <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
//             <h4 class="font-semibold text-yellow-800 mb-2">
//               ⏱ During the Test
//             </h4>
//             <ul class="list-disc pl-5 space-y-2 text-yellow-700 text-sm">
//               <li>Select the correct option for each question</li>
//               <li>You may change answers before submission</li>
//               <li><b>Do not refresh or close</b> the browser</li>
//               <li>Timer starts immediately after you begin</li>
//             </ul>
//           </div>

//           <!-- Agreement -->
//           <div class="flex items-start mt-4">
//             <input 
//               type="checkbox" 
//               id="agreeTerms" 
//               class="w-5 h-5 mt-1 mr-2 cursor-pointer"
//             />
//             <label for="agreeTerms" class="text-gray-700 text-sm cursor-pointer">
//               I have read and understood all the instructions
//             </label>
//           </div>
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: `
//         <span style="display:flex;align-items:center;gap:6px;">
//           ▶️ Start Test
//         </span>
//       `,
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#22c55e",
//       cancelButtonColor: "#ef4444",
//       allowOutsideClick: false,
//       allowEscapeKey: false,

//       didOpen: () => {
//         const confirmBtn = Swal.getConfirmButton();
//         const checkbox = Swal.getPopup().querySelector("#agreeTerms");

//         confirmBtn.disabled = true;
//         confirmBtn.style.opacity = "0.6";

//         checkbox.addEventListener("change", () => {
//           confirmBtn.disabled = !checkbox.checked;
//           confirmBtn.style.opacity = checkbox.checked ? "1" : "0.6";
//         });
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigate(`/test/${test._id}`);
//       } else {
//         navigate(-1); // optional: go back if cancelled
//       }
//     });
//   }, [navigate, test]);

//   return null; // no button, popup opens automatically
// }



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";

export default function TestInstructions() {
  const navigate = useNavigate();
  const { testId  } = useParams(); // get test ID from URL
  const [test, setTest] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch test data by ID
  useEffect(() => {
    async function fetchTest() {
      try {
        const res = await apiClient.get(`/api/tests/${testId}`);
        setTest(res.data?.data); // extract the actual test object
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    }

    if (testId) fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading instructions...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load test data.</p>
      </div>
    );
  }

  const duration = test.testDuration?.minutes ?? "—";
  const questions = test.totalQuestions ?? "—";

  return (
<div className="relative max-h-screen flex justify-center py-4 px-4">
  {/* Background Image with Blur */}
  <div
    className="absolute inset-0 bg-cover bg-center filter blur-sm"
    style={{
      backgroundImage: "url('https://png.pngtree.com/background/20230520/original/pngtree-students-test-out-exam-materials-picture-image_2670982.jpg')",
    }}
  ></div>

  {/* Optional Dark Overlay */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* Content */}
  <div className="relative z-10 w-full max-w-3xl bg-white/90 shadow-2xl rounded-lg p-8">
  {/* Header */}
  <div className="flex items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-900">
      {test.title} — Instructions
    </h1>
  </div>

  {/* General Guidelines */}
  <div className="bg-blue-100 border border-blue-300 p-5 rounded-lg mb-6">
    <h2 className="font-semibold text-blue-900 mb-3">
      📌 General Guidelines
    </h2>
    <ul className="list-disc pl-6 space-y-2 text-blue-800 text-sm">
      <li>Total duration: <b>{duration} minutes</b></li>
      <li>Total questions: <b>{questions}</b></li>
      <li>Each question carries equal marks</li>
      <li>No negative marking</li>
    </ul>
  </div>

  {/* During Test */}
  <div className="bg-yellow-100 border border-yellow-300 p-5 rounded-lg mb-6">
    <h2 className="font-semibold text-yellow-900 mb-3">
      ⏱ During the Test
    </h2>
    <ul className="list-disc pl-6 space-y-2 text-yellow-800 text-sm">
      <li>Select the correct option for each question</li>
      <li>You may change answers before submission</li>
      <li className="font-semibold text-yellow-900">
        Do not refresh or close the browser
      </li>
      <li>Timer starts immediately after you begin</li>
    </ul>
  </div>

  {/* Agreement */}
  <div className="flex items-start mb-8">
    <input
      type="checkbox"
      id="agree"
      className="w-5 h-5 mt-1 mr-3 cursor-pointer accent-green-600"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
    <label htmlFor="agree" className="text-gray-900 text-sm cursor-pointer">
      I have read and understood all the instructions
    </label>
  </div>

  {/* Actions */}
  <div className="flex justify-between">
    {/* <button
      onClick={() => navigate(-1)}
      className="px-6 py-2 rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400"
    >
      Cancel
    </button> */}

    <button
      disabled={!agreed}
      onClick={() => navigate(`/test/${test._id}`)}
      className={`px-8 py-2 rounded-lg text-white font-medium transition
        ${agreed
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-emerald-300 cursor-not-allowed"
        }`}
    >
      ▶️ Start Test
    </button>
  </div>
</div>

</div>

  );
}
