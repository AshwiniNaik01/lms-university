import Cookies from "js-cookie";
import { useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAssignments,
  setBatchInfo,
} from "../../../features/assignmentSlice";

const AssignmentsTab = ({ batch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const studentId = Cookies.get("studentId"); // get the logged-in studentId

  // Get assignments from Redux
  const { assignments } = useSelector((state) => state.assignments);

  // Set batch info and assignments in Redux
  useEffect(() => {
    if (!batch?._id) return;

    dispatch(setBatchInfo({ batchId: batch._id, batchName: batch.batchName }));
    dispatch(setAssignments(batch.assignments || []));
  }, [batch, dispatch]);

  if (!batch) return <div>Loading batch...</div>;

  {/* Helper: find student's submission */}
  const getSubmissionForAssignment = (a) =>
    a.submissions?.find((s) => s.student === studentId) || null;

/* Helper: overdue check */
const isAssignmentOverdue = (deadline) => new Date(deadline) < new Date();


  // const getSubmissionForAssignment = (a) =>
  //   a?.submissions?.length > 0 ? a.submissions[0] : null;

  // const isAssignmentOverdue = (date) => new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-8">
      <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6 max-h-fit">
        <div className="flex items-center gap-6 mb-6 bg-white p-6 rounded-2xl shadow-lg border">
          <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg flex items-center justify-center">
            <FaTasks className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Batch Assignments
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage all assignments for{" "}
              <span className="font-semibold">{batch?.batchName}</span>
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-gray-500 font-medium">
                Total Assignments:
              </span>
              <span className="text-xl md:text-2xl font-bold text-orange-600">
                {assignments?.length}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* <StatCard
            count={
              assignments.filter((a) => getSubmissionForAssignment(a))?.length
            }
            label="Submitted"
            color="blue"
            onClick={() =>
              navigate(`/batch/${batch._id}/assignments?filter=submitted`)
            }
          /> */}


       <StatCard
  count={
    assignments.filter((a) => {
      const s = getSubmissionForAssignment(a);
      return s && s.status === "check";  // ONLY "check"
    }).length
  }
  label="Submitted"
  color="blue"
  onClick={() =>
    navigate(`/batch/${batch._id}/assignments?filter=submitted`)
  }
/>


          <StatCard
            count={
              assignments.filter((a) => !getSubmissionForAssignment(a))?.length
            }
            label="Unsubmitted"
            color="red"
            onClick={() =>
              navigate(`/batch/${batch._id}/assignments?filter=unsubmitted`)
            }
          />

          {/* <StatCard
            count={
              assignments.filter(
                (a) => getSubmissionForAssignment(a)?.status === "checked"
              )?.length
            }
            label="Graded"
            color="green"
            onClick={() =>
              navigate(`/batch/${batch._id}/assignments?filter=graded`)
            }
          /> */}

          <StatCard
            count={
              assignments.filter((a) => {
                const submission = getSubmissionForAssignment(a);
                return (
                  submission &&
                  submission.score != null &&
                  submission.status === "submitted"
                );
              }).length
            }
            label="Graded"
            color="green"
            onClick={() =>
              navigate(`/batch/${batch._id}/assignments?filter=graded`)
            }
          />

          {/* <StatCard
  count={
    assignments.filter((a) => {
      const submission = a.submissions?.find(
        (s) =>
          s.student === studentId &&
          s.mistakePhotos?.length > 0 &&
          s.status === "unsubmitted"
      );
      return submission;
    }).length
  }
  label="Resubmit"
  color="red"
  onClick={() =>
    navigate(`/batch/${batch._id}/assignments?filter=resubmit`) // Use batch._id here
  }
/> */}

 <StatCard
  count={
    assignments.filter((a) => {
      const submission = a.submissions?.find(
        (s) => s.student === studentId
      );

      // Only consider assignments where:
      // 1️⃣ Submission exists
      // 2️⃣ Status is "unsubmitted"
      // 3️⃣ Mistake photos exist
      return submission && submission.status === "unsubmitted" && submission.mistakePhotos?.length > 0;
    }).length
  }
  label="ReSubmit"
  color="red"
  onClick={() =>
    navigate(`/batch/${batch._id}/assignments?filter=resubmit`)
  }
/>



          {/* <StatCard
            count={
              assignments.filter((a) =>
                isAssignmentOverdue(a.deadline || a.dueDate)
              )?.length
            }
            label="Overdue"
            color="purple"
            onClick={() =>
              navigate(`/batch/${batch._id}/assignments?filter=overdue`)
            }
          /> */}
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
