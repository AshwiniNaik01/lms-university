
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import SubmittedAssignments from "./SubmittedAssignments";
import OverdueAssignments from "./OverdueAssignments";
import UnsubmittedAssignments from "./UnsubmittedAssignments";
import ViewSubmissionModal from "./ViewSubmissionModal";
import SubmitAssignmentModal from "./SubmitAssignmentModal";
import GradedAssignments from "./GradedAssignments";
import GradedAssignmentModal from "./GradedAssignmentModal";

const AssignmentsPage = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewModal, setViewModal] = useState(null); // { assignment, submission }
  const [submitModal, setSubmitModal] = useState(null); // assignment object

  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data } = await apiClient.get("/api/assignments");
      setAssignments(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>

      {filter === "submitted" && (
        <SubmittedAssignments
          assignments={assignments}
          studentId={studentId}
          setViewModal={setViewModal}
        />
      )}

      {filter === "overdue" && (
        <OverdueAssignments assignments={assignments} studentId={studentId} />
      )}

      {filter === "unsubmitted" && (
        <UnsubmittedAssignments
          assignments={assignments}
          studentId={studentId}
          setSubmitModal={setSubmitModal}
        />
      )}

      {filter === "graded" && (
        <GradedAssignments
          assignments={assignments}
          studentId={studentId}
          setViewModal={setViewModal} // will open GradedAssignmentModal
        />
      )}

      {!filter && <div className="text-gray-500">Please select a filter.</div>}

      {/* View Submission Modal */}
      {viewModal && (
        <ViewSubmissionModal
          assignment={viewModal.assignment}
          submission={viewModal.submission}
          onClose={() => setViewModal(null)}
          studentId={studentId}
          refreshAssignments={loadAssignments}
        />
      )}

      {/* Submit Assignment Modal */}
      {submitModal && (
        <SubmitAssignmentModal
          assignment={submitModal}
          studentId={studentId}
          refreshAssignments={loadAssignments}
          onClose={() => setSubmitModal(null)}
        />
      )}

      {/* View or Graded Modal */}
    {viewModal && (() => {
  const { submission } = viewModal;

  // 1️⃣ If there are mistake photos → show resubmit modal
  if (submission.mistakePhotos?.length > 0) {
    return (
      <GradedAssignmentModal
        assignment={viewModal.assignment}
        submission={submission}
        onClose={() => setViewModal(null)}
        studentId={studentId}
        refreshAssignments={loadAssignments}
      />
    );
  }

  // 2️⃣ If score exists (>= 0) → show graded modal (read-only)
  if (submission.score != null) {
    return (
      <GradedAssignmentModal
        assignment={viewModal.assignment}
        submission={submission}
        onClose={() => setViewModal(null)}
        studentId={studentId}
        refreshAssignments={loadAssignments}
      />
    );
  }

  // 3️⃣ Otherwise → normal view submission modal
  return (
    <ViewSubmissionModal
      assignment={viewModal.assignment}
      submission={submission}
      onClose={() => setViewModal(null)}
      studentId={studentId}
      refreshAssignments={loadAssignments}
    />
  );
})()}

    </div>
  );
};

export default AssignmentsPage;
