import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import apiClient from '../../../api/axiosConfig';
import { createPhase, fetchPhases, fetchWeeks } from '../../../api/curriculum';

export default function AddCurriculum() {
   const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const phaseId = searchParams.get('phaseId');
  const weekId = searchParams.get('weekId');
  const [step, setStep] = useState(1);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availablePhases, setAvailablePhases] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  useEffect(() => {
    if (courseId) {
      console.log("Adding Phase for Course ID:", courseId);
    } else if (phaseId) {
      console.log("Adding Week for Phase ID:", phaseId);
    } else if (weekId) {
      console.log("Adding Chapter for Week ID:", weekId);
    }
  }, [courseId, phaseId, weekId]);

  useEffect(() => {
  if (courseId) setStep(1);
  else if (phaseId) setStep(2);
  else if (weekId) setStep(3);
}, [courseId, phaseId, weekId]);



  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesResp, phasesResp, weeksResp] = await Promise.all([
          apiClient.get('/api/courses/all'),
          apiClient.get('/api/phases'),
          apiClient.get('/api/weeks'),
        ]);
        setAvailableCourses(coursesResp.data?.data || []);
        setAvailablePhases(phasesResp.data?.data || []);
        setAvailableWeeks(weeksResp.data?.data || []);
      } catch (err) {
        showToast('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Refresh data after successful operations

  const refreshData = async () => {
    try {
      const [phases, weeks] = await Promise.all([fetchPhases(), fetchWeeks()]);
      setAvailablePhases(phases);
      setAvailableWeeks(weeks);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };


  // Phase Form
  // const phaseFormik = useFormik({
  //   initialValues: {
  //     course: '',
  //     title: '',
  //     description: '',
  //   },
  //   validationSchema: Yup.object({
  //     course: Yup.string().required('Course is required'),
  //     title: Yup.string().required('Title is required'),
  //     description: Yup.string().required('Description is required'),
  //   }),
  //   onSubmit: async (values, { resetForm }) => {
  //     setLoading(true);
  //     try {
  //       await apiClient.post('/api/phases', [values]);
  //       showToast('🎉 Phase created successfully!', 'success');
  //       resetForm();
  //       await refreshData();
  //     } catch (err) {
  //       showToast('❌ Error creating phase: ' + (err.response?.data?.message || err.message), 'error');
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  // });

  const phaseFormik = useFormik({
  enableReinitialize: true, // ✅ important
  initialValues: {
    course: courseId || '',
    title: '',
    description: '',
  },
  validationSchema: Yup.object({
    course: Yup.string().required('Course is required'),
    title: Yup.string().required('Title is required'),
    // description: Yup.string().required('Description is required'),
  }),
  onSubmit: async (values, { resetForm }) => {
    setLoading(true);
    try {
 await createPhase(values);
      showToast('🎉 Phase created successfully!', 'success');
      resetForm();
      await refreshData();
    } catch (err) {
      showToast('❌ Error creating phase: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  },
});

// // ✅ Define this helper before using
// const getNextWeekNumber = (phaseId) => {
//   const phaseWeeks = availableWeeks.filter(w => w.phase === phaseId);
//   if (phaseWeeks.length === 0) return 1;
//   return Math.max(...phaseWeeks.map(w => w.weekNumber)) + 1;
// };

  // Weeks Form
const weeksFormik = useFormik({
  enableReinitialize: true,
  initialValues: {
    phaseId: phaseId || '',
    weeks: [{ weekNumber: 1, title: '' }],
  },
    validationSchema: Yup.object({
      phaseId: Yup.string().required('Phase is required'),
      weeks: Yup.array()
        .of(
          Yup.object({
            weekNumber: Yup.number().min(1).required('Week number is required'),
            // title: Yup.string().required('Week title is required'),
          })
        )
        .min(1, 'At least one week is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const weekPromises = values.weeks.map(week =>
          apiClient.post('/api/weeks', [{ ...week, phase: values.phaseId }])
        );
        await Promise.all(weekPromises);
        showToast('🎉 Weeks created successfully!', 'success');
        resetForm();
        await refreshData();
      } catch (err) {
        showToast('❌ Error creating weeks: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setLoading(false);
      }
    },
  });
// useEffect(() => {
//   if (weeksFormik.values.phaseId && availableWeeks.length > 0) {
//     const nextWeek = getNextWeekNumber(weeksFormik.values.phaseId);

//     const currentWeekNumber = weeksFormik.values.weeks[0]?.weekNumber;

//     // Only set nextWeek if the field is empty
//     if (currentWeekNumber === '' || currentWeekNumber === null || currentWeekNumber === undefined) {
//       weeksFormik.setFieldValue('weeks[0].weekNumber', nextWeek);
//     }
//   }
// }, [weeksFormik.values.phaseId, availableWeeks]);


  // Chapter Form
  const chapterFormik = useFormik({
  enableReinitialize: true,
  initialValues: {
    week: weekId || '',
    title: '',
    points: [{ title: '', description: '' }],
  },
    validationSchema: Yup.object({
      week: Yup.string().required('Week is required'),
      title: Yup.string().required('Title is required'),
      points: Yup.array()
        .of(
          Yup.object({
            title: Yup.string().required('Point title is required'),
            // description: Yup.string().required('Description is required'),
          })
        )
        .min(1, 'At least one learning point is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await apiClient.post('/api/chapters', [values]);
        showToast('🎉 Chapter created successfully!', 'success');
        resetForm();
        await refreshData();
      } catch (err) {
        showToast('❌ Error creating chapter: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  // Toast Component
  const Toast = ({ message, type, onClose }) => (
    <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 animate-slide-in ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200 font-bold">✕</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-2">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎯 Curriculum Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Build your course curriculum step by step
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            {[
              { label: '1. Create Phase', value: 1, icon: '🏗️' },
              { label: '2. Add Weeks', value: 2, icon: '📅' },
              { label: '3. Build Chapters', value: 3, icon: '📚' },
            ].map(({ label, value, icon }) => (
              <div key={value} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setStep(value)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    step === value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="hidden sm:block">{label}</span>
                </button>
                <div className={`w-full h-1 mt-3 rounded-full ${
                  step >= value ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold">Processing...</p>
            </div>
          </div>
        )}

        {/* Phase Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🏗️</span>
              Create New Phase
            </h2>
            <form onSubmit={phaseFormik.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  name="course"
                  value={phaseFormik.values.course}
                  onChange={phaseFormik.handleChange}
                  onBlur={phaseFormik.handleBlur}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="">Choose a Course</option>
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {phaseFormik.touched.course && phaseFormik.errors.course && (
                  <p className="text-red-500 text-sm mt-1">{phaseFormik.errors.course}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phase Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={phaseFormik.values.title}
                  onChange={phaseFormik.handleChange}
                  onBlur={phaseFormik.handleBlur}
                  placeholder="e.g., Foundations, Advanced Concepts, etc."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {phaseFormik.touched.title && phaseFormik.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{phaseFormik.errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={phaseFormik.values.description}
                  onChange={phaseFormik.handleChange}
                  onBlur={phaseFormik.handleBlur}
                  placeholder="Describe what students will learn in this phase..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
                {phaseFormik.touched.description && phaseFormik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{phaseFormik.errors.description}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : '🚀 Create Phase'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Next: Add Weeks →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Weeks Form */}
        {step === 2 && (
          <FormikProvider value={weeksFormik}>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">📅</span>
                Add Weeks to Phase
              </h2>
              <form onSubmit={weeksFormik.handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Phase
                  </label>
                  <select
                    name="phaseId"
                    value={weeksFormik.values.phaseId}
                    onChange={weeksFormik.handleChange}
                    onBlur={weeksFormik.handleBlur}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Choose a Phase</option>
                    {availablePhases.map((phase) => (
                      <option key={phase._id} value={phase._id}>
                        {phase.title}
                      </option>
                    ))}
                  </select>
                  {weeksFormik.touched.phaseId && weeksFormik.errors.phaseId && (
                    <p className="text-red-500 text-sm mt-1">{weeksFormik.errors.phaseId}</p>
                  )}
                </div>

                <FieldArray name="weeks">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-gray-700">
                          Week Details
                        </label>
                        <button
                          type="button"
                          onClick={() => push({ weekNumber: weeksFormik.values.weeks.length + 1, title: '' })}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                          ➕ Add Week
                        </button>
                      </div>

                      {weeksFormik.values.weeks.map((week, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                          <div className="flex gap-4 items-start">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Week Number
                              </label>
                              <input
                                type="number"
                                name={`weeks.${index}.weekNumber`}
                                value={week.weekNumber}
                                onChange={weeksFormik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                min="1"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Week Title
                              </label>
                              <input
                                type="text"
                                name={`weeks.${index}.title`}
                                value={week.title}
                                onChange={weeksFormik.handleChange}
                                placeholder="e.g., JavaScript Fundamentals"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={weeksFormik.values.weeks.length === 1}
                              className="text-red-500 hover:text-red-700 disabled:text-gray-400 mt-6"
                            >
                              🗑️
                            </button>
                          </div>
                          {weeksFormik.errors.weeks?.[index] && (
                            <p className="text-red-500 text-sm mt-2">
                              {Object.values(weeksFormik.errors.weeks[index]).join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    ← Back to Phases
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : '🚀 Create Weeks'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Next: Add Chapters →
                  </button>
                </div>
              </form>
            </div>
          </FormikProvider>
        )}

        {/* Chapter Form */}
        {step === 3 && (
          <FormikProvider value={chapterFormik}>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span>
                Build Chapter Content
              </h2>
              <form onSubmit={chapterFormik.handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Week
                  </label>
                  <select
                    name="week"
                    value={chapterFormik.values.week}
                    onChange={chapterFormik.handleChange}
                    onBlur={chapterFormik.handleBlur}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Choose a Week</option>
                    {availableWeeks.map((week) => (
                      <option key={week._id} value={week._id}>
                        Week {week.weekNumber}: {week.title}
                      </option>
                    ))}
                  </select>
                  {chapterFormik.touched.week && chapterFormik.errors.week && (
                    <p className="text-red-500 text-sm mt-1">{chapterFormik.errors.week}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={chapterFormik.values.title}
                    onChange={chapterFormik.handleChange}
                    onBlur={chapterFormik.handleBlur}
                    placeholder="e.g., Introduction to React Components"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  {chapterFormik.touched.title && chapterFormik.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{chapterFormik.errors.title}</p>
                  )}
                </div>

                <FieldArray name="points">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-gray-700">
                          Learning Points
                        </label>
                        <button
                          type="button"
                          onClick={() => push({ title: '', description: '' })}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                          ➕ Add Point
                        </button>
                      </div>

                      {chapterFormik.values.points.map((point, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Point Title
                                </label>
                                <input
                                  type="text"
                                  name={`points.${index}.title`}
                                  value={point.title}
                                  onChange={chapterFormik.handleChange}
                                  placeholder="e.g., Understanding JSX"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  name={`points.${index}.description`}
                                  value={point.description}
                                  onChange={chapterFormik.handleChange}
                                  placeholder="Detailed explanation..."
                                  rows="3"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={chapterFormik.values.points.length === 1}
                              className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                            >
                              🗑️
                            </button>
                          </div>
                          {chapterFormik.errors.points?.[index] && (
                            <p className="text-red-500 text-sm mt-2">
                              {Object.values(chapterFormik.errors.points[index]).join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    ← Back to Weeks
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : '🚀 Create Chapter'}
                  </button>
                </div>
              </form>
            </div>
          </FormikProvider>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}