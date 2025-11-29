// import { useState } from "react";
// import {
//   FaBook,
//   FaCalendar,
//   FaCheckCircle,
//   FaClock,
//   FaDownload,
//   FaExpand,
//   FaEye,
//   FaFileAlt,
//   FaGithub,
//   FaLink,
//   FaTasks,
//   FaTimes,
//   FaUpload,
//   FaUser,
// } from "react-icons/fa";
// import { DIR } from "../../utils/constants";

// const AssignmentsTab = ({ course }) => {
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [expandedAssignment, setExpandedAssignment] = useState(null);
//   const [submissionForm, setSubmissionForm] = useState({
//     assignmentId: null,
//     submissionType: "file",
//     file: null,
//     githubLink: "",
//     otherLink: "",
//     comments: "",
//   });
//   const [submissions, setSubmissions] = useState([]);

//   const assignments =
//     course.phases?.flatMap((phase) =>
//       phase.weeks.flatMap((week) =>
//         week.chapters.flatMap((chapter) =>
//           (chapter.assignments || []).map((assignment) => ({
//             ...assignment,
//             phase: phase.title,
//             week: week.title,
//             chapter: chapter.title,
//             phaseId: phase._id,
//             weekId: week._id,
//             chapterId: chapter._id,
//           }))
//         )
//       )
//     ) || [];

//   const handleAssignmentClick = (assignment) => {
//     setSelectedAssignment(assignment);
//   };

//   const handleCloseAssignment = () => {
//     setSelectedAssignment(null);
//     setExpandedAssignment(null);
//   };

//   const toggleExpandAssignment = (assignmentId) => {
//     setExpandedAssignment(
//       expandedAssignment === assignmentId ? null : assignmentId
//     );
//   };

//   const handleSubmissionSubmit = (e) => {
//     e.preventDefault();

//     const newSubmission = {
//       id: Date.now(),
//       assignmentId: submissionForm.assignmentId,
//       assignmentTitle: assignments.find(
//         (a) => a._id === submissionForm.assignmentId
//       )?.title,
//       submissionType: submissionForm.submissionType,
//       file: submissionForm.file,
//       githubLink: submissionForm.githubLink,
//       otherLink: submissionForm.otherLink,
//       comments: submissionForm.comments,
//       submittedAt: new Date().toISOString(),
//       status: "submitted",
//       grade: null,
//       feedback: "",
//     };

//     setSubmissions((prev) => [newSubmission, ...prev]);
//     setSubmissionForm({
//       assignmentId: null,
//       submissionType: "file",
//       file: null,
//       githubLink: "",
//       otherLink: "",
//       comments: "",
//     });
//   };

//   const handleFileChange = (e) => {
//     setSubmissionForm((prev) => ({
//       ...prev,
//       file: e.target.files[0],
//     }));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "submitted":
//         return "bg-blue-100 text-blue-600 border-blue-200";
//       case "reviewed":
//         return "bg-green-100 text-green-600 border-green-200";
//       case "graded":
//         return "bg-purple-100 text-purple-600 border-purple-200";
//       case "rejected":
//         return "bg-red-100 text-red-600 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-600 border-gray-200";
//     }
//   };

//   const isAssignmentDue = (dueDate) => {
//     return new Date(dueDate) < new Date();
//   };

//   const getDueDateColor = (dueDate) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays < 0) return "text-red-600 bg-red-50 border-red-200";
//     if (diffDays <= 3) return "text-orange-600 bg-orange-50 border-orange-200";
//     return "text-green-600 bg-green-50 border-green-200";
//   };

//   const getSubmissionForAssignment = (assignmentId) => {
//     return submissions.find((sub) => sub.assignmentId === assignmentId);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
//             <FaTasks className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Course Assignments
//             </h1>
//             <p className="text-gray-600 mt-1 text-lg">
//               Practice, submit, and track your assignments for {course.title}
//             </p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//           <div className="bg-gradient-to-r from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200">
//             <div className="text-2xl font-bold text-orange-600">
//               {assignments.length}
//             </div>
//             <div className="text-sm text-orange-700 font-medium">
//               Total Assignments
//             </div>
//           </div>
//           <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
//             <div className="text-2xl font-bold text-blue-600">
//               {
//                 assignments.filter((a) => getSubmissionForAssignment(a._id))
//                   .length
//               }
//             </div>
//             <div className="text-sm text-blue-700 font-medium">Submitted</div>
//           </div>
//           <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
//             <div className="text-2xl font-bold text-green-600">
//               {submissions.filter((s) => s.status === "graded").length}
//             </div>
//             <div className="text-sm text-green-700 font-medium">Graded</div>
//           </div>
//           <div className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200">
//             <div className="text-2xl font-bold text-purple-600">
//               {assignments.filter((a) => isAssignmentDue(a.dueDate)).length}
//             </div>
//             <div className="text-sm text-purple-700 font-medium">Overdue</div>
//           </div>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-1 gap-8">
//         {/* Assignments List */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
//             <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-amber-100">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                 <FaTasks className="text-orange-600" />
//                 All Assignments
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Complete assignments to track your progress
//               </p>
//             </div>

//             <div className="p-6">
//               {assignments.length > 0 ? (
//                 <div className="space-y-4">
//                   {assignments.map((assignment, index) => {
//                     const submission = getSubmissionForAssignment(
//                       assignment._id
//                     );
//                     const isDue = isAssignmentDue(assignment.dueDate);

//                     return (
//                       <div
//                         key={assignment._id}
//                         className="border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white group"
//                       >
//                         <div className="p-5">
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-start gap-4 flex-1">
//                               {/* Assignment Icon */}
//                               <div className="flex-shrink-0">
//                                 <div
//                                   className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${
//                                     submission
//                                       ? "bg-gradient-to-br from-green-500 to-emerald-600"
//                                       : "bg-gradient-to-br from-orange-500 to-red-600"
//                                   }`}
//                                 >
//                                   {submission ? (
//                                     <FaCheckCircle className="w-5 h-5" />
//                                   ) : (
//                                     <FaTasks className="w-5 h-5" />
//                                   )}
//                                 </div>
//                               </div>

//                               {/* Assignment Content */}
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-start justify-between mb-2">
//                                   <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
//                                     {assignment.title}
//                                   </h3>
//                                   <div className="flex items-center gap-2">
//                                     {submission && (
//                                       <span
//                                         className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                                           submission.status
//                                         )}`}
//                                       >
//                                         {submission.status
//                                           .charAt(0)
//                                           .toUpperCase() +
//                                           submission.status.slice(1)}
//                                       </span>
//                                     )}
//                                     <span
//                                       className={`px-2 py-1 rounded-full text-xs font-medium border ${getDueDateColor(
//                                         assignment.dueDate
//                                       )}`}
//                                     >
//                                       <FaClock className="w-3 h-3 inline mr-1" />
//                                       Due:{" "}
//                                       {new Date(
//                                         assignment.dueDate
//                                       ).toLocaleDateString()}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* Assignment Context */}
//                                 <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
//                                   <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
//                                     <FaBook className="w-3 h-3" />
//                                     {assignment.chapter}
//                                   </span>
//                                   <span className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
//                                     <FaCalendar className="w-3 h-3" />
//                                     {assignment.week}
//                                   </span>
//                                   <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
//                                     📁 {assignment.phase}
//                                   </span>
//                                 </div>

//                                 {/* Assignment Description */}
//                                 {assignment.description && (
//                                   <div className="relative">
//                                     <p
//                                       className={`text-gray-600 text-sm leading-relaxed ${
//                                         expandedAssignment === assignment._id
//                                           ? ""
//                                           : "line-clamp-2"
//                                       }`}
//                                     >
//                                       {assignment.description}
//                                     </p>
//                                     {assignment.description.length > 100 && (
//                                       <button
//                                         onClick={() =>
//                                           toggleExpandAssignment(assignment._id)
//                                         }
//                                         className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-1 flex items-center gap-1"
//                                       >
//                                         {expandedAssignment ===
//                                         assignment._id ? (
//                                           <>
//                                             <FaTimes className="w-3 h-3" />
//                                             Show Less
//                                           </>
//                                         ) : (
//                                           <>
//                                             <FaExpand className="w-3 h-3" />
//                                             Read More
//                                           </>
//                                         )}
//                                       </button>
//                                     )}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Actions */}
//                           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
//                             <div className="flex items-center gap-2 text-sm text-gray-500">
//                               <FaUser className="w-3 h-3" />
//                               <span>
//                                 Assignment {index + 1} of {assignments.length}
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() =>
//                                   handleAssignmentClick(assignment)
//                                 }
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
//                               >
//                                 <FaEye className="w-4 h-4" />
//                                 View Details
//                               </button>

//                               {assignment.fileUrl && (
//                                 <a
//                                   // href={assignment.fileUrl}
//                                    href={`${DIR.ASSIGNMENT_FILES}${assignment.fileUrl}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
//                                   download
//                                 >
//                                   <FaDownload className="w-4 h-4" />
//                                   Download
//                                 </a>
//                               )}

//                               <button
//                                 onClick={() =>
//                                   setSubmissionForm((prev) => ({
//                                     ...prev,
//                                     assignmentId: assignment._id,
//                                   }))
//                                 }
//                                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
//                                   submission
//                                     ? "bg-purple-600 text-white hover:bg-purple-700"
//                                     : "bg-orange-600 text-white hover:bg-orange-700"
//                                 }`}
//                               >
//                                 <FaUpload className="w-4 h-4" />
//                                 {submission ? "Resubmit" : "Submit"}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <FaTasks className="w-10 h-10 text-gray-400" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                     No Assignments Available
//                   </h3>
//                   <p className="text-gray-500 max-w-md mx-auto">
//                     Assignments will be added by your instructor as the course
//                     progresses.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Submission Form & History */}

//         <div className="space-y-6">
//           {/* Submission Form */}

//           {submissionForm.assignmentId && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg bg-opacity-40 px-4">
//               {/* Modal container */}
//               <div className="relative bg-white rounded-2xl shadow-2xl border w-full max-w-5xl max-h-[80vh] overflow-y-auto animate-fade-in-down">
//                 {/* Modal Header */}
//                 <div className="sticky top-0 z-10 p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-100">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <FaUpload className="text-blue-600" />
//                       Submit Assignment
//                     </h2>
//                     <button
//                       onClick={() =>
//                         setSubmissionForm((prev) => ({
//                           ...prev,
//                           assignmentId: null,
//                         }))
//                       }
//                       className="text-gray-400 hover:text-gray-600 transition-colors"
//                       aria-label="Close"
//                     >
//                       <FaTimes className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <p className="text-gray-600 mt-1">
//                     For:{" "}
//                     {
//                       assignments.find(
//                         (a) => a._id === submissionForm.assignmentId
//                       )?.title
//                     }
//                   </p>
//                 </div>

//                 {/* Modal Body */}
//                 <form
//                   onSubmit={handleSubmissionSubmit}
//                   className="p-4 space-y-6"
//                 >
//                   {/* Submission Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       How would you like to submit?
//                     </label>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                       {[
//                         {
//                           value: "file",
//                           label: "File Upload",
//                           icon: FaFileAlt,
//                           desc: "PDF, ZIP, etc.",
//                         },
//                         {
//                           value: "github",
//                           label: "GitHub",
//                           icon: FaGithub,
//                           desc: "Repository link",
//                         },
//                         {
//                           value: "link",
//                           label: "Live Link",
//                           icon: FaLink,
//                           desc: "Website or demo",
//                         },
//                       ].map((type) => (
//                         <button
//                           key={type.value}
//                           type="button"
//                           onClick={() =>
//                             setSubmissionForm((prev) => ({
//                               ...prev,
//                               submissionType: type.value,
//                             }))
//                           }
//                           className={`p-2 border-2 rounded-xl text-center transition-all duration-300 ${
//                             submissionForm.submissionType === type.value
//                               ? "border-blue-500 bg-blue-50 shadow-md"
//                               : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
//                           }`}
//                         >
//                           <type.icon
//                             className={`w-4 h-4 mx-auto mb-2 ${
//                               submissionForm.submissionType === type.value
//                                 ? "text-blue-600"
//                                 : "text-gray-400"
//                             }`}
//                           />
//                           <div
//                             className={`font-medium ${
//                               submissionForm.submissionType === type.value
//                                 ? "text-blue-700"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             {type.label}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {type.desc}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* File Upload */}
//                   {submissionForm.submissionType === "file" && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Upload Your Work
//                       </label>
//                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 text-center hover:border-blue-400 transition-colors">
//                         <input
//                           type="file"
//                           onChange={handleFileChange}
//                           accept=".pdf,.zip,.rar,.7z,.doc,.docx,.txt"
//                           className="hidden"
//                           id="assignment-file-upload"
//                         />
//                         <label
//                           htmlFor="assignment-file-upload"
//                           className="cursor-pointer"
//                         >
//                           <FaUpload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
//                           <div className="text-gray-600">
//                             {submissionForm.file ? (
//                               <div className="text-green-600 text-sm">
//                                 ✓ {submissionForm.file.name} (
//                                 {formatFileSize(submissionForm.file.size)})
//                               </div>
//                             ) : (
//                               "Click to upload or drag and drop"
//                             )}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             PDF, ZIP, DOC up to 25MB
//                           </div>
//                         </label>
//                       </div>
//                     </div>
//                   )}

//                   {/* GitHub Link */}
//                   {submissionForm.submissionType === "github" && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         GitHub Repository URL
//                       </label>
//                       <input
//                         type="url"
//                         placeholder="https://github.com/username/repository"
//                         value={submissionForm.githubLink}
//                         onChange={(e) =>
//                           setSubmissionForm((prev) => ({
//                             ...prev,
//                             githubLink: e.target.value,
//                           }))
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                       />
//                     </div>
//                   )}

//                   {/* Other Link */}
//                   {submissionForm.submissionType === "link" && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Project URL (Live demo, CodePen, etc.)
//                       </label>
//                       <input
//                         type="url"
//                         placeholder="https://your-project.com"
//                         value={submissionForm.otherLink}
//                         onChange={(e) =>
//                           setSubmissionForm((prev) => ({
//                             ...prev,
//                             otherLink: e.target.value,
//                           }))
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                       />
//                     </div>
//                   )}

//                   {/* Comments */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Additional Notes (Optional)
//                     </label>
//                     <textarea
//                       placeholder="Describe your approach, challenges faced, or anything you'd like the instructor to know..."
//                       value={submissionForm.comments}
//                       onChange={(e) =>
//                         setSubmissionForm((prev) => ({
//                           ...prev,
//                           comments: e.target.value,
//                         }))
//                       }
//                       rows="3"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       disabled={
//                         !submissionForm.submissionType ||
//                         (submissionForm.submissionType === "file" &&
//                           !submissionForm.file) ||
//                         (submissionForm.submissionType === "github" &&
//                           !submissionForm.githubLink) ||
//                         (submissionForm.submissionType === "link" &&
//                           !submissionForm.otherLink)
//                       }
//                       className="max-w-[250px] bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       Submit Assignment
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Assignment Detail Modal */}
//       {selectedAssignment && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-md animate-fade-in-down">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
//             {/* Header */}
//             <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-amber-100 flex items-center justify-between">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-1">
//                   {selectedAssignment.title}
//                 </h3>
//                 <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                   {["phase", "week", "chapter"].map((key) => (
//                     <span
//                       key={key}
//                       className="bg-white px-3 py-1 rounded-full border"
//                     >
//                       {selectedAssignment[key]}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 onClick={handleCloseAssignment}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-2"
//               >
//                 <FaTimes className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 overflow-y-auto flex-grow">
//               <div className="space-y-6">
//                 {/* Description */}
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">
//                     Assignment Description
//                   </h4>
//                   <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//                     {selectedAssignment.description}
//                   </p>
//                 </div>

//                 {/* Due Date & Status */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Due Date</div>
//                     <div
//                       className={`font-semibold ${
//                         getDueDateColor(selectedAssignment.dueDate).split(
//                           " "
//                         )[0]
//                       }`}
//                     >
//                       {new Date(
//                         selectedAssignment.dueDate
//                       ).toLocaleDateString()}
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Status</div>
//                     <div className="font-semibold text-gray-800">
//                       {getSubmissionForAssignment(selectedAssignment._id)
//                         ? "✅ Submitted"
//                         : "❌ Not Started"}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Download Link */}
//                 {selectedAssignment.fileUrl && (
//                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                     <h5 className="font-semibold text-blue-900 mb-2">
//                       Assignment Files
//                     </h5>
//                     <a
//                       href={selectedAssignment.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
//                       download
//                     >
//                       <FaDownload className="w-4 h-4" />
//                       Download Assignment Resources
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div className="text-sm text-gray-500">
//                 Created:{" "}
//                 <span className="font-medium text-gray-700">
//                   {new Date(
//                     selectedAssignment.createdAt || Date.now()
//                   ).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex gap-3 w-full sm:w-auto justify-end">
//                 <button
//                   onClick={handleCloseAssignment}
//                   className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSubmissionForm((prev) => ({
//                       ...prev,
//                       assignmentId: selectedAssignment._id,
//                     }));
//                     handleCloseAssignment();
//                   }}
//                   className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto"
//                 >
//                   <FaUpload className="w-4 h-4" />
//                   Submit Assignment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignmentsTab;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaTasks } from "react-icons/fa";
// import apiClient from "../../api/axiosConfig";

// const AssignmentsTab = ({ course }) => {
//   const navigate = useNavigate();
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         setLoading(true);

//         const { data: assignmentsRes } = await apiClient.get("/api/assignments");

//         const courseAssignments =
//           assignmentsRes.data?.filter(
//             (a) => a.course?._id === course._id && a.isActive
//           ) || [];

//         setAssignments(courseAssignments);
//       } catch (error) {
//         console.error("Error fetching assignments:", error);
//         setAssignments([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignments();
//   }, [course._id]);

//   const getSubmissionForAssignment = (assignment) =>
//     assignment.submissions?.length > 0 ? assignment.submissions[0] : null;

//   const isAssignmentDue = (dueDate) => new Date(dueDate) < new Date();

//   const unsubmittedCount =
//     assignments?.filter((a) => !getSubmissionForAssignment(a))?.length || 0;

//   const handleCardClick = (filterType) => {
//     navigate(`/course/${course._id}/assignments?filter=${filterType}`);
//   };

//   if (loading) return <div>Loading assignments...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-8">
//       <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
//             <FaTasks className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Course Assignments</h1>
//             <p className="text-gray-600 mt-1 text-lg">
//               Practice, submit, and track your assignments for {course?.title || ""}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
//           {/* Total Assignments */}
//           <div
//             onClick={() => handleCardClick("all")}
//             className="cursor-pointer bg-gradient-to-r from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200 hover:scale-105 transition-transform"
//           >
//             <div className="text-2xl font-bold text-orange-600">
//               {assignments?.length || 0}
//             </div>
//             <div className="text-sm text-orange-700 font-medium">Total Assignments</div>
//           </div>

//           {/* Submitted */}
//           <div
//             onClick={() => handleCardClick("submitted")}
//             className="cursor-pointer bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200 hover:scale-105 transition-transform"
//           >
//             <div className="text-2xl font-bold text-blue-600">
//               {assignments?.filter((a) => getSubmissionForAssignment(a))?.length || 0}
//             </div>
//             <div className="text-sm text-blue-700 font-medium">Submitted</div>
//           </div>

//           {/* Unsubmitted */}
//           <div
//             onClick={() => handleCardClick("unsubmitted")}
//             className="cursor-pointer bg-gradient-to-r from-red-50 to-pink-100 rounded-xl p-4 border border-red-200 hover:scale-105 transition-transform"
//           >
//             <div className="text-2xl font-bold text-red-600">{unsubmittedCount}</div>
//             <div className="text-sm text-red-700 font-medium">Unsubmitted</div>
//           </div>

//           {/* Graded */}
//           {/* Graded */}
// <div
//   onClick={() => handleCardClick("graded")}
//   className="cursor-pointer bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 hover:scale-105 transition-transform"
// >
//   <div className="text-2xl font-bold text-green-600">
//     {assignments?.filter(
//       (a) => getSubmissionForAssignment(a)?.status === "checked"
//     )?.length || 0}
//   </div>
//   <div className="text-sm text-green-700 font-medium">Graded</div>
// </div>

//           {/* Overdue */}
//           <div
//             onClick={() => handleCardClick("overdue")}
//             className="cursor-pointer bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200 hover:scale-105 transition-transform"
//           >
//             <div className="text-2xl font-bold text-purple-600">
//               {assignments?.filter((a) =>
//                 isAssignmentDue(a.deadline || a.dueDate)
//               )?.length || 0}
//             </div>
//             <div className="text-sm text-purple-700 font-medium">Overdue</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignmentsTab;


// AssignmentsTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import apiClient from "../../api/axiosConfig";
import { FaTasks } from "react-icons/fa";
import apiClient from "../../../api/axiosConfig";

const AssignmentsTab = ({ course }) => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure course exists before loading
  useEffect(() => {
    if (!course?._id) return;

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const { data: assignmentsRes } = await apiClient.get("/api/assignments");

        const courseAssignments =
          assignmentsRes?.data?.filter(
            (a) => a?.course?._id === course._id && a?.isActive
          ) || [];

        setAssignments(courseAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [course?._id]);

  if (!course) return <div>Loading course...</div>;
  if (loading) return <div>Loading assignments...</div>;

  const getSubmissionForAssignment = (a) =>
    a?.submissions?.length > 0 ? a.submissions[0] : null;

  const isAssignmentOverdue = (date) =>
    new Date(date) < new Date(); // past deadline

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-8">
      <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
            <FaTasks className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Assignments</h1>
            <p className="text-gray-600 mt-1">
              Track and manage all assignments for {course?.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">

          {/* Total */}
          <StatCard
            count={assignments?.length}
            label="Total Assignments"
            color="orange"
            onClick={() => navigate(`/course/${course._id}/assignments?filter=all`)}
          />

          {/* Submitted */}
          <StatCard
            count={assignments.filter((a) => getSubmissionForAssignment(a))?.length}
            label="Submitted"
            color="blue"
            onClick={() =>
              navigate(`/course/${course._id}/assignments?filter=submitted`)
            }
          />

          {/* Unsubmitted */}
          <StatCard
            count={
              assignments.filter((a) => !getSubmissionForAssignment(a))?.length
            }
            label="Unsubmitted"
            color="red"
            onClick={() =>
              navigate(`/course/${course._id}/assignments?filter=unsubmitted`)
            }
          />

          {/* Graded */}
          <StatCard
            count={
              assignments.filter(
                (a) => getSubmissionForAssignment(a)?.status === "checked"
              )?.length
            }
            label="Graded"
            color="green"
            onClick={() =>
              navigate(`/course/${course._id}/assignments?filter=graded`)
            }
          />

          {/* Overdue */}
          <StatCard
            count={
              assignments.filter((a) =>
                isAssignmentOverdue(a.deadline || a.dueDate)
              )?.length
            }
            label="Overdue"
            color="purple"
            onClick={() =>
              navigate(`/course/${course._id}/assignments?filter=overdue`)
            }
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ count, label, color, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-${color}-50 rounded-xl p-4 border hover:scale-105 transition-transform`}
  >
    <div className={`text-2xl font-bold text-${color}-600`}>{count || 0}</div>
    <div className={`text-sm text-${color}-700`}>{label}</div>
  </div>
);

export default AssignmentsTab;

