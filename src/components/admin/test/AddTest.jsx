import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { fetchBatchesByCourseId } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import handleApiError from "../../../utils/handleApiError";
import { canPerformAction } from "../../../utils/permissionUtils";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import RadioButtonGroup from "../../form/RadioButtonGroup";
import { useCourseParam } from "../../hooks/useCourseParam";
import { COURSE_NAME } from "../../../utils/constants";

const AddTest = ({ onClose, onTestAdded }) => {
  const formikRef = useRef(null);
  const fileRef = useRef();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [phases, setPhases] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [batches, setBatches] = useState([]);
  // const [selectedCourseId, setSelectedCourseId] = useState(initialValues.courseId);
  const { rolePermissions } = useSelector((state) => state.permissions);

  const testLevelOptions = [
    { _id: "Beginner", title: "Beginner" },
    { _id: "Intermediate", title: "Intermediate" },
    { _id: "Advanced", title: "Advanced" },
  ];

  // ----> MOVE initialValues HERE
  const initialValues = {
    title: "",
    testLevel: "Beginner",
    courseId: "",
    phaseId: "",
    weekId: "",
    chapterId: "",
    batchId: "",
    totalMarks: "",
    passingMarks: "",
    minutes: "",
    seconds: "0",
    userType: "0",
    reportType: "1",
    excelFile: null,
  };

  // Load courses from API
  const [selectedCourseId, setSelectedCourseId, isPreselected] =
    useCourseParam(courses);

  const validationSchema = Yup.object({
    title: Yup.string().required("Test Title is required"),
    // courseId: Yup.string().required("Training Program is required"),
    // phaseId: Yup.string().required("Phase is required"),
    // weekId: Yup.string().required("Week is required"),
    //    chapterId: Yup.string()
    // //   .required("Chapter is required")
    //   .test("valid-objectid", "Invalid Chapter", (value) => {
    //     return value && /^[0-9a-fA-F]{24}$/.test(value); // basic ObjectId validation
    //   }),

    // batchId: Yup.string().required("Batch is required"),
    // totalMarks: Yup.number().required("Total Marks are required").min(1),
    // passingMarks: Yup.number().required("Passing Marks are required").min(1),
    // minutes: Yup.number().required("Duration is required").min(1),
    // seconds: Yup.number().required("Seconds are required").min(0),
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      //   const token = Cookies.get("token"); // if your API requires it
      try {
        let data = await getAllCourses();

        // If your API needs token in headers, modify getAllCourses to accept headers
        // or handle it here by using apiClient.get('/api/courses/all', { headers: { Authorization: `Bearer ${token}` } });

        setCourses(data || []);
      } catch (error) {
        console.error(`Error fetching ${COURSE_NAME}:`, error);
        Swal.fire({
          icon: "error",
          title: handleApiError(error) || `Failed to load ${COURSE_NAME}`,
          text: "Please try again later",
        });
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (isPreselected && selectedCourseId) {
      formikRef.current?.setFieldValue("courseId", selectedCourseId);
    }
  }, [isPreselected, selectedCourseId]);

  // Fetch phases when course is selected
  useEffect(() => {
    const fetchPhases = async () => {
      if (!selectedCourseId) return; // use state that updates when user selects a course

      try {
        const response = await apiClient.get(
          `/api/phases/course/${selectedCourseId}`
        );
        setPhases(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching phases:", error);
        setPhases([]);
      }
    };

    fetchPhases();
  }, [selectedCourseId]);

  // Fetch chapters when week is selected
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedCourseId) return; // <-- fetch only if courseId exists

      try {
        const response = await apiClient.get(
          `/api/chapters/course/${selectedCourseId}`
        );
        setChapters(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setChapters([]);
      }
    };

    fetchChapters();
  }, [selectedCourseId]);

  // Fetch batches
  useEffect(() => {
    const getBatches = async () => {
      if (!selectedCourseId) return;

      try {
        const data = await fetchBatchesByCourseId(selectedCourseId);
        setBatches(data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        Swal.fire({
          icon: "error",
          title: handleApiError(error) || "Failed to load batches",
          text: error.message || "Please try again later",
        });
        setBatches([]);
      }
    };

    getBatches();
  }, [selectedCourseId]);

  // Handle Excel file upload
  const handleExcelUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFieldValue("excelFile", file);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Empty File",
          text: "The uploaded file contains no data.",
          confirmButtonColor: "#f0ad4e",
        });
        setSelectedQuestions([]);
        return;
      }

      // Validate Excel structure
      let hasErrors = false;
      jsonData.forEach((question, index) => {
        const requiredFields = [
          "question",
          "optionA",
          "optionB",
          // "optionC",
          // "optionD",
          "correctAns",
          "marks",
          "chapterName",
        ];
        const missingFields = requiredFields.filter(
          (field) => !question[field]
        );

        if (missingFields.length > 0) {
          hasErrors = true;
          showWarnInQuestionUpload(index + 1, missingFields.join(", "));
        }
      });

      if (hasErrors) {
        fileRef.current.value = "";
        setSelectedQuestions([]);
      } else {
        Swal.fire({
          icon: "success",
          title: `${jsonData.length} Questions Found`,
          text: "All questions are properly formatted.",
          confirmButtonColor: "#28a745",
        });
        setSelectedQuestions(jsonData);
      }
    };

    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "File Read Error",
        text: "Failed to read the Excel file.",
        confirmButtonColor: "#d33",
      });
    };
  };

  const showWarnInQuestionUpload = (questionNumber, missingFields) => {
    Swal.fire({
      icon: "warning",
      title: `Issue in Question No. ${questionNumber}`,
      text: `Missing fields: ${missingFields}. Please check the Excel file.`,
      confirmButtonColor: "#d33",
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);

    try {
      if (!values.excelFile) {
        Swal.fire({
          icon: "warning",
          title: "No File",
          text: "Please upload an Excel file to create a test.",
          confirmButtonColor: "#f0ad4e",
        });
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // Upload Excel file
      const formData = new FormData();
      formData.append("file", values.excelFile);
      formData.append("title", values.title);
      formData.append("testLevel", values.testLevel);
      formData.append("courseId", values.courseId || "");
      formData.append("chapterId", values.chapterId || "");
      formData.append("batchId", values.batchId || "");
      formData.append("phaseId", values.phaseId || "");
      formData.append("totalMarks", values.totalMarks);
      formData.append("minutes", values.minutes);
      formData.append("seconds", values.seconds);
      formData.append("userType", values.userType);
      formData.append("reportType", values.reportType || "");
      formData.append("passingMarks", values.passingMarks);

      const response = await apiClient.post(
        `/api/tests/upload-excel`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Test Created!",
          text:
            response.data.message ||
            "Test created successfully via Excel upload!",
          confirmButtonColor: "#28a745",
        });

        // Reset form
        resetForm();
        setFileName("");
        setSelectedQuestions([]);

        // Call parent callback if needed
        onTestAdded?.();
        onClose?.();

        // Navigate to ManageTest page
        if (canPerformAction(rolePermissions, "test", "read")) {
          navigate("/manage-test");
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Creation Failed",
          text:
            response.data.message || "Failed to create test. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error creating test:", error);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text:
          error.response?.data?.message ||
          "Failed to create test. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className="p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]">
          {/* Header */}
          <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center mb-6">
            ➕ Add Assessment Test
          </h2>

          {/* Test Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Test Title*"
              name="title"
              type="text"
              formik={formik}
            />

            <Dropdown
              label="Test Level (optional)"
              name="testLevel"
              options={[
                { _id: "Beginner", title: "Beginner" },
                { _id: "Intermediate", title: "Intermediate" },
                { _id: "Advanced", title: "Advanced" },
              ]}
              formik={formik}
            />
          </div>

          {/* Course Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course */}
            <Dropdown
              label={`${COURSE_NAME}*`}
              name="courseId"
              options={courses}
              formik={formik}
              disabled={isPreselected}
              onChange={(value) => setSelectedCourseId(value)} // 🔥 now works!
            />

            {/* Phase */}
            {/* <Dropdown
              label="Phase (optional)"
              name="phaseId"
              options={phases}
              formik={formik}
            />

            {/* Chapter */}
            {/* <Dropdown
              label="Chapter (optional)"
              name="chapterId"
              options={chapters}
              formik={formik}
            /> */}

            {/* Batch */}
            <Dropdown
              label="Batch*"
              name="batchId"
              options={batches.map((b) => ({
                _id: b._id,
                title: b.batchName,
              }))}
              formik={formik}
            />
          </div>

          {/* Marks & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputField
              label="Total Marks*"
              name="totalMarks"
              type="number"
              formik={formik}
            />
            <InputField
              label="Passing Marks*"
              name="passingMarks"
              type="number"
              formik={formik}
            />
            <InputField
              label="Minutes*"
              name="minutes"
              type="number"
              formik={formik}
            />
            <InputField
              label="Seconds (optional)"
              name="seconds"
              type="number"
              formik={formik}
            />
          </div>

          {/* User Type & Report Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioButtonGroup
              label="Type (optional)"
              name="userType"
              formik={formik}
              options={[
                { label: "Without Login (Open to all)", value: "0" },
                { label: "With Login", value: "1" },
              ]}
            />
            <RadioButtonGroup
              label="Report Type (optional)"
              name="reportType"
              formik={formik}
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
            />
          </div>

          {/* Excel Upload Section */}
          <div className="bg-gray-50 border-2 border-dashed border-[rgba(14,85,200,0.3)] rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-[rgba(14,85,200,0.83)] mb-4">
              📘 Upload Excel File*
            </h3>

            <div className="flex flex-col md:flex-row md:items-center justify-center gap-5">
              <label className="flex items-center justify-center gap-3 bg-gradient-to-r from-[rgba(14,85,200,0.9)] to-[rgba(14,85,200,0.7)] text-white px-6 py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all">
                <FiUpload className="text-xl" />
                <span className="font-medium">Choose Excel File</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={(e) => handleExcelUpload(e, formik.setFieldValue)}
                />
              </label>

              <a
                href="/Sample_Test.xlsx"
                download
                className="flex items-center gap-2 text-[rgba(14,85,200,0.83)] font-medium hover:underline transition-all text-sm md:text-base"
              >
                <FiDownload className="text-lg" />
                Download Sample
              </a>
            </div>

            {/* File Info */}
            <div className="mt-4 text-sm text-gray-600">
              {fileName ? (
                <p className="font-medium">
                  ✅ File Selected:{" "}
                  <span className="text-[rgba(14,85,200,0.83)]">
                    {fileName}
                  </span>
                </p>
              ) : (
                <p className="italic text-gray-500">No file selected yet</p>
              )}
            </div>

            {selectedQuestions.length > 0 && (
              <div className="mt-3 text-green-600 font-medium text-sm bg-green-50 border border-green-200 px-4 py-2 rounded-lg inline-block">
                {selectedQuestions.length} questions loaded successfully ✅
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={formik.isSubmitting || loading}
              className="bg-[rgba(14,85,200,0.83)] text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-[rgba(14,85,200,1)] transition duration-300 disabled:opacity-50"
            >
              {formik.isSubmitting || loading
                ? "Creating Test..."
                : "Create Test"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="ml-4 bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddTest;
