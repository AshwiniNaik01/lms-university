
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import apiClient from '../../../api/axiosConfig';
import { getAllCourses } from '../../../api/courses';

export default function AddAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setAvailableCourses(res);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      course: '',
      chapter: '',
      title: '',
      description: '',
      deadline: '',
      fileUrl: null,
    },
    validationSchema: Yup.object({
      course: Yup.string().required('Course is required'),
      chapter: Yup.string().required('Chapter is required'),
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      deadline: Yup.string().required('Deadline is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        if (assignmentId) {
          // Update assignment
          await apiClient.put(`/api/assignments/${assignmentId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('✅ Assignment updated successfully!');
        } else {
          // Add assignment
          await apiClient.post('/api/assignments', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('✅ Assignment created successfully!');
        }

        resetForm();
        navigate('/admin/manage-assignments');
      } catch (err) {
        console.error(err);
        alert('❌ Failed to submit assignment: ' + (err.response?.data?.message || err.message));
      }
    },
  });

  // ✅ Fetch chapters when course changes
  useEffect(() => {
    const fetchChaptersByCourse = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }

      try {
        const res = await apiClient.get(`/api/chapters/course/${courseId}`);
        setAvailableChapters(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching chapters for course:', err);
        setAvailableChapters([]);
      }
    };

    fetchChaptersByCourse();
  }, [formik.values.course]);

  // ✅ Fetch assignment when editing
  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/assignments/${assignmentId}`);
        if (res.data.success && res.data.data) {
          const assignment = res.data.data;
          formik.setValues({
            course: assignment.chapter?.course?._id || '',
            chapter: assignment.chapter?._id || '',
            title: assignment.title || '',
            description: assignment.description || '',
            deadline: assignment.deadline?.split('T')[0] || '',
            fileUrl: null,
          });
        } else {
          alert('Assignment not found');
          navigate('/admin/manage-assignments');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to fetch assignment');
        navigate('/admin/manage-assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  if (loading) return <p className="text-center mt-10">Loading assignment...</p>;

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto space-y-6 border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          {assignmentId ? 'Edit Assignment' : 'Add Assignment'}
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Dropdown */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Course</label>
            <select
              name="course"
              value={formik.values.course}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Course</option>
              {availableCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {formik.touched.course && formik.errors.course && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.course}</p>
            )}
          </div>

          {/* Chapter Dropdown (based on selected course) */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Chapter</label>
            <select
              name="chapter"
              value={formik.values.chapter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.course}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="">Select Chapter</option>
              {availableChapters.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.title} ({ch.phaseData?.title || 'No Phase'})
                </option>
              ))}
            </select>
            {formik.touched.chapter && formik.errors.chapter && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.chapter}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formik.values.deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.deadline && formik.errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.deadline}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">File (PDF)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              onChange={(e) => formik.setFieldValue('fileUrl', e.currentTarget.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {assignmentId ? 'Update Assignment' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
