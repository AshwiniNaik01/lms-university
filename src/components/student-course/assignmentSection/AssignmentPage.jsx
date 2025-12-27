


import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  setBatchInfo,
  setAssignments,
} from "../../../features/assignmentSlice";
import apiClient from "../../../api/axiosConfig";

import SubmittedAssignments from "./SubmittedAssignments";
import UnsubmittedAssignments from "./UnsubmittedAssignments";
import GradedAssignments from "./GradedAssignments";
import ResubmitAssignments from "./ResubmitAssignments";
import ViewSubmissionModal from "./ViewSubmissionModal";
import SubmitAssignmentModal from "./SubmitAssignmentModal";
import GradedAssignmentModal from "./GradedAssignmentModal";
import ResubmitAssignmentModal from "./ResubmitAssignmentModal";

const AssignmentsPage = () => {
  const dispatch = useDispatch();
  const { batchId: paramBatchId } = useParams();
  const [loading, setLoading] = useState(true);

  // Redux state
  const { batchId, batchName } = useSelector((state) => state.assignments);

  const [viewModal, setViewModal] = useState(null);
  const [submitModal, setSubmitModal] = useState(null);
  const [resubmitModal, setResubmitModal] = useState(null);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const studentId = Cookies.get("studentId");

  // Fetch batch and assignments
  useEffect(() => {
    const loadBatch = async () => {
      try {
        setLoading(true);

        if (!batchId || batchId !== paramBatchId) {
          const { data } = await apiClient.get(
            `/api/batches/batches/${paramBatchId}`
          );
          const batchData = data.data;

          dispatch(
            setBatchInfo({ batchId: batchData._id, batchName: batchData.batchName })
          );
          dispatch(setAssignments(batchData.assignments || []));
        }
      } catch (err) {
        console.error("Failed to fetch batch:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBatch();
  }, [batchId, paramBatchId, dispatch]);

  if (loading || !batchId) return <div>Loading batch…</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignments — {batchName}</h1>

      {/* -------- Filters -------- */}
      {filter === "submitted" && (
        <SubmittedAssignments studentId={studentId} setViewModal={setViewModal} />
      )}

      {filter === "unsubmitted" && (
        <UnsubmittedAssignments studentId={studentId} setSubmitModal={setSubmitModal} />
      )}

      {filter === "graded" && (
        <GradedAssignments studentId={studentId} setViewModal={setViewModal} />
      )}

      {filter === "resubmit" && (
        <ResubmitAssignments
          studentId={studentId}
          setViewModal={({ assignment, submission }) =>
            setResubmitModal({ assignment, submission })
          }
        />
      )}

      {!filter && (
        <div className="text-gray-500">
          Please select a filter from the Assignments tab.
        </div>
      )}

      {/* -------- Modals -------- */}
      {submitModal && (
        <SubmitAssignmentModal
          assignment={submitModal}
          studentId={studentId}
          onClose={() => setSubmitModal(null)}
        />
      )}

      {viewModal &&
        (() => {
          const { submission, assignment } = viewModal;

          if (submission.score != null && submission.status === "submitted") {
            return (
              <GradedAssignmentModal
                assignment={assignment}
                submission={submission}
                studentId={studentId}
                onClose={() => setViewModal(null)}
              />
            );
          }

          return (
            <ViewSubmissionModal
              assignment={assignment}
              submission={submission}
              studentId={studentId}
              onClose={() => setViewModal(null)}
            />
          );
        })()}

      {resubmitModal && (
        <ResubmitAssignmentModal
          assignment={resubmitModal.assignment}
          submission={resubmitModal.submission}
          onClose={() => setResubmitModal(null)}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;


// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setBatchInfo,
//   setAssignments,
// } from "../../../features/assignmentSlice";
// import apiClient from "../../../api/axiosConfig"; // Axios instance for API calls

// import SubmittedAssignments from "./SubmittedAssignments";
// import UnsubmittedAssignments from "./UnsubmittedAssignments";
// import OverdueAssignments from "./OverdueAssignments";
// import GradedAssignments from "./GradedAssignments";
// import ViewSubmissionModal from "./ViewSubmissionModal";
// import SubmitAssignmentModal from "./SubmitAssignmentModal";
// import GradedAssignmentModal from "./GradedAssignmentModal";
// import ResubmitAssignments from "./ResubmitAssignments";
// import ResubmitAssignmentModal from "./ResubmitAssignmentModal";

// const AssignmentsPage = () => {
//   const dispatch = useDispatch();
//   const { batchId: paramBatchId } = useParams(); // Get batchId from URL
//   const [loading, setLoading] = useState(true);

//   // Get Redux state
//   const { batchId, batchName, assignments } = useSelector(
//     (state) => state.assignments
//   );

//   const [viewModal, setViewModal] = useState(null);
//   const [submitModal, setSubmitModal] = useState(null);
//    const [resubmitModal, setResubmitModal] = useState(null); // New state for resubmit modal

//   const [searchParams] = useSearchParams();
//   const filter = searchParams.get("filter");

//   const studentId = Cookies.get("studentId");

//   // Fetch batch and assignments if Redux is empty or batchId mismatches
//   useEffect(() => {
//     const loadBatch = async () => {
//       try {
//         setLoading(true);

//         // Only fetch if Redux has no batch or batchId mismatch
//         if (!batchId || batchId !== paramBatchId) {
//           const { data } = await apiClient.get(
//             `/api/batches/batches/${paramBatchId}`
//           );
//           const batchData = data.data;

//           dispatch(
//             setBatchInfo({ batchId: batchData._id, batchName: batchData.batchName })
//           );
//           dispatch(setAssignments(batchData.assignments || []));
//         }
//       } catch (err) {
//         console.error("Failed to fetch batch:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBatch();
//   }, [batchId, paramBatchId, dispatch]);

//   if (loading || !batchId) return <div>Loading batch…</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">
//         Assignments — {batchName}
//       </h1>

//       {/* -------- Filters -------- */}
//       {filter === "submitted" && (
//         <SubmittedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setViewModal={setViewModal}
//         />
//       )}

//       {filter === "unsubmitted" && (
//         <UnsubmittedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setSubmitModal={setSubmitModal}
//         />
//       )}

//       {filter === "graded" && (
//         <GradedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setViewModal={setViewModal}
//         />
//       )}


//  {filter === "resubmit" && (
//         <ResubmitAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setViewModal={({ assignment, submission }) =>
//             setResubmitModal({ assignment, submission })
//           } // Open the resubmit modal
//         />
//       )}



//       {/* {filter === "overdue" && (
//         <OverdueAssignments assignments={assignments} studentId={studentId} />
//       )} */}

//       {!filter && (
//         <div className="text-gray-500">
//           Please select a filter from the Assignments tab.
//         </div>
//       )}

//       {/* -------- Submit Modal -------- */}
//       {submitModal && (
//         <SubmitAssignmentModal
//           assignment={submitModal}
//           studentId={studentId}
//           onClose={() => setSubmitModal(null)}
//         />
//       )}

//       {/* -------- View / Graded Modal Logic -------- */}
//       {viewModal &&
//         (() => {
//           const { submission, assignment } = viewModal;

//           if (submission.score != null && submission.status == "submitted") {
//             return (
//               <GradedAssignmentModal
//                 assignment={assignment}
//                 submission={submission}
//                 studentId={studentId}
//                 onClose={() => setViewModal(null)}
//               />
//             );
//           }

//           return (
//             <ViewSubmissionModal
//               assignment={assignment}
//               submission={submission}
//               studentId={studentId}
//               onClose={() => setViewModal(null)}
//             />
//           );
//         })()}


//         {/* -------- Resubmit Modal -------- */}
//       {resubmitModal && (
//         <ResubmitAssignmentModal
//           assignment={resubmitModal.assignment}
//           submission={resubmitModal.submission}
//           onClose={() => setResubmitModal(null)}
//           refreshAssignments={() => {
//             // Refresh assignments from API after resubmission
//             apiClient
//               .get(`/api/batches/batches/${batchId}`)
//               .then(({ data }) =>
//                 dispatch(setAssignments(data.data.assignments || []))
//               )
//               .catch((err) => console.error(err));
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default AssignmentsPage;


// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useDispatch, useSelector } from "react-redux";
// // import { setBatchInfo, setAssignments } from "../features/assignmentSlice"; // import actions
// // import { setBatchInfo, setAssignments } from "../../../features/videoSlice";
// import { setBatchInfo, setAssignments } from "../../../features/assignmentSlice";

// import SubmittedAssignments from "./SubmittedAssignments";
// import OverdueAssignments from "./OverdueAssignments";
// import UnsubmittedAssignments from "./UnsubmittedAssignments";
// import ViewSubmissionModal from "./ViewSubmissionModal";
// import SubmitAssignmentModal from "./SubmitAssignmentModal";
// import GradedAssignments from "./GradedAssignments";
// import GradedAssignmentModal from "./GradedAssignmentModal";


// const AssignmentsPage = ({ batch }) => {
//   const dispatch = useDispatch();
//   const { assignments } = useSelector((state) => state.assignments); // get assignments from Redux

//   const [viewModal, setViewModal] = useState(null);
//   const [submitModal, setSubmitModal] = useState(null);

//   const [searchParams] = useSearchParams();
//   const filter = searchParams.get("filter");

//   const studentId = Cookies.get("studentId");

//   // Debug: log props
//   console.log("Batch prop:", batch);

//   // Load batch info & assignments into Redux store
//   useEffect(() => {
//     if (batch?._id) {
//       console.log("Dispatching batch info to Redux:", batch._id, batch.batchName);
//       dispatch(setBatchInfo({ batchId: batch._id, batchName: batch.batchName }));
//       console.log("Dispatching assignments to Redux:", batch.assignments);
//       dispatch(setAssignments(batch.assignments || []));
//     }
//   }, [batch, dispatch]);

//   // Debug: log assignments from Redux
//   console.log("Assignments from Redux:", assignments);

//   if (!batch) return <div>Loading batch…</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">
//         Assignments — {batch.batchName}
//       </h1>

//       {/* -------- Filters -------- */}
//       {filter === "submitted" && (
//         <SubmittedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setViewModal={setViewModal}
//         />
//       )}

//       {filter === "unsubmitted" && (
//         <UnsubmittedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setSubmitModal={setSubmitModal}
//         />
//       )}

//       {filter === "graded" && (
//         <GradedAssignments
//           assignments={assignments}
//           studentId={studentId}
//           setViewModal={setViewModal}
//         />
//       )}

//       {filter === "overdue" && (
//         <OverdueAssignments assignments={assignments} studentId={studentId} />
//       )}

//       {!filter && (
//         <div className="text-gray-500">
//           Please select a filter from the Assignments tab.
//         </div>
//       )}

//       {/* -------- Submit Modal -------- */}
//       {submitModal && (
//         <SubmitAssignmentModal
//           assignment={submitModal}
//           studentId={studentId}
//           onClose={() => setSubmitModal(null)}
//         />
//       )}

//       {/* -------- View / Graded Modal Logic -------- */}
//       {viewModal &&
//         (() => {
//           const { submission, assignment } = viewModal;
//           console.log("Opening view modal:", submission, assignment);

//           // If graded OR has mistake photos → show graded/resubmit modal
//           if (submission.score != null || submission.mistakePhotos?.length > 0) {
//             return (
//               <GradedAssignmentModal
//                 assignment={assignment}
//                 submission={submission}
//                 studentId={studentId}
//                 onClose={() => setViewModal(null)}
//               />
//             );
//           }

//           // Otherwise → show normal view
//           return (
//             <ViewSubmissionModal
//               assignment={assignment}
//               submission={submission}
//               studentId={studentId}
//               onClose={() => setViewModal(null)}
//             />
//           );
//         })()}
//     </div>
//   );
// };



// export default AssignmentsPage;

