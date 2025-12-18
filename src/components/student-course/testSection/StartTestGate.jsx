import { useParams, Navigate } from "react-router-dom";
// import { getStudentAuthFromCookies } from "../utils/authCookies";
import TestInstructions from "./TestInstructions";
import StudentEmailLogin from "./StudentEmailLogin";
import { getStudentAuthFromCookies } from "../../../utils/authCookies";

export default function StartTestGate() {
  const { testId } = useParams();
  const { studentId, token, role } = getStudentAuthFromCookies();

  const isAuthenticated =
    studentId && token && role === "student";

  return isAuthenticated ? (
    <TestInstructions testId={testId} />
  ) : (
    <StudentEmailLogin redirectTestId={testId} />
  );
}
