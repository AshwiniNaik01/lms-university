
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { fetchCourseById, getAllCourses } from "../../../api/courses";
import { useCourseParam } from "../../hooks/useCourseParam";

// Enhanced Modal Component
const Modal = ({ title, values, onSave, onClose, type = "edit" }) => {
  const [formData, setFormData] = useState(values);

  const handleChange = (key, val) => setFormData({ ...formData, [key]: val });

  const handlePointChange = (index, key, val) => {
    const updatedPoints = [...(formData.points || [])];
    updatedPoints[index][key] = val;
    setFormData({ ...formData, points: updatedPoints });
  };

  const handleAddPoint = () => {
    setFormData({
      ...formData,
      points: [...(formData.points || []), { title: "", description: "" }],
    });
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = formData.points.filter((_, i) => i !== index);
    setFormData({ ...formData, points: updatedPoints });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl w-[600px] shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {type === "delete" ? "🗑️" : "✏️"} {title}
        </h2>

        {type === "delete" ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-gray-700 text-lg mb-2">
              Are you sure you want to delete this?
            </p>
            <p className="text-gray-500">This action cannot be undone.</p>
          </div>
        ) : (
          <>
            {/* Title field */}
            <div className="mb-6">
              <label className="text-gray-700 text-sm font-semibold mb-2 block">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter title..."
              />
            </div>

            {/* Description field for phases */}
            {formData.description !== undefined && (
              <div className="mb-6">
                <label className="text-gray-700 text-sm font-semibold mb-2 block">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  placeholder="Enter description..."
                />
              </div>
            )}

            {/* Week number field for weeks */}
            {formData.weekNumber !== undefined && (
              <div className="mb-6">
                <label className="text-gray-700 text-sm font-semibold mb-2 block">
                  Sub-topic's Number
                </label>
                <input
                  type="number"
                  value={formData.weekNumber || ""}
                  onChange={(e) =>
                    handleChange("weekNumber", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  min="1"
                />
              </div>
            )}

            {/* Points for chapters */}
            {formData.points !== undefined && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 text-sm font-semibold">
                    Learning Points
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-all"
                  >
                    ➕ Add Point
                  </button>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {(formData.points || []).map((point, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">
                          Point {index + 1}
                        </h4>
                        <button
                          onClick={() => handleRemovePoint(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Point Title"
                        value={point.title}
                        onChange={(e) =>
                          handlePointChange(index, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-200"
                      />
                      <textarea
                        placeholder="Description"
                        value={point.description}
                        onChange={(e) =>
                          handlePointChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className={`px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all ${
              type === "delete"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {type === "delete" ? "🗑️ Delete" : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 animate-slide-in ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <span>{message}</span>
    <button
      onClick={onClose}
      className="text-white hover:text-gray-200 font-bold"
    >
      ✕
    </button>
  </div>
);

const ManageCurriculum = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [phases, setPhases] = useState([]);
  const [openPhase, setOpenPhase] = useState(null);
  const [openWeek, setOpenWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

   // ✅ Use custom hook to get preselected course from URL
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(courses);
  

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData || []);
      } catch (error) {
        showToast("❌ Failed to load training program", "error");
      }
    };

    fetchCourses();
  }, []);

   // ✅ Whenever courses or selectedCourseFromParam change, set selected course
  useEffect(() => {
    if (selectedCourseFromParam && courses.length > 0) {
      setSelectedCourse(selectedCourseFromParam);
      fetchPhases(selectedCourseFromParam);
    }
  }, [selectedCourseFromParam, courses]);

  // Fetch Phases for selected course
  const fetchPhases = async (courseId) => {
    if (!courseId) return;

    setLoading(true);
    try {
      const course = await fetchCourseById(courseId);
      setPhases(course?.phases || []);
    } catch (error) {
      showToast("❌ Failed to load curriculum", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setOpenPhase(null);
    setOpenWeek(null);
    if (id) fetchPhases(id);
  };

  // CRUD Operations
  const updateEntity = async (url, payload, successMsg) => {
    setLoading(true);
    try {
      await apiClient.put(url, payload);
      showToast(`✅ ${successMsg}`, "success");
      fetchPhases(selectedCourse);
    } catch (err) {
      showToast(
        `❌ Failed to update: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (url, successMsg) => {
    setLoading(true);
    try {
      await apiClient.delete(url);
      showToast(`✅ ${successMsg}`, "success");
      fetchPhases(selectedCourse);
    } catch (err) {
      showToast(
        `❌ Failed to delete: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Phase Operations
  const handleEditPhase = (phase) => {
    setModal({
      title: "Edit Phase",
      values: {
        title: phase.title,
        description: phase.description,
        course: selectedCourse,
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/phases/${phase._id}`,
          data,
          "Topic updated successfully!"
        );
      },
    });
  };

  const handleDeletePhase = (phase) => {
    setModal({
      title: "Delete Topic",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(`/api/phases/${phase._id}`, "Topic deleted successfully!");
      },
      type: "delete",
    });
  };

  // Week Operations
  const handleEditWeek = (week) => {
    setModal({
      title: "Edit Sub-Topic",
      values: {
        title: week.title,
        weekNumber: week.weekNumber,
        phase: week.phase,
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/weeks/${week._id}`,
          data,
          "Sub-Topic updated successfully!"
        );
      },
    });
  };

  const handleDeleteWeek = (week) => {
    setModal({
      title: "Delete Sub-Topic",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(`/api/weeks/${week._id}`, "Sub-Topic deleted successfully!");
      },
      type: "delete",
    });
  };

  // Chapter Operations
  const handleEditChapter = (chapter) => {
    setModal({
      title: "Edit Chapter",
      values: {
        title: chapter.title || "",
        points: chapter.points || [],
        week: chapter.week,
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/chapters/${chapter._id}`,
          data,
          "Chapter updated successfully!"
        );
      },
    });
  };

  const handleDeleteChapter = (chapter) => {
    setModal({
      title: "Delete Chapter",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(
          `/api/chapters/${chapter._id}`,
          "Chapter deleted successfully!"
        );
      },
      type: "delete",
    });
  };

  return (
    <div className="max-h-fit bg-gradient-to-br from-blue-50 via-white to-purple-50 py-2">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-start mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📚 Manage Curriculum
          </h1>
         <hr />
        </div>

        {/* Course Selector */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-2">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            🎯 Select Training Program
          </label>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="">-- Choose a Training Program --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div> */}

        <div
  className={`bg-white rounded-lg shadow-lg p-6 mb-2 ${
    isCoursePreselected ? "opacity-50 pointer-events-none" : ""
  }`}
>
  <label className="block text-lg font-semibold text-gray-700 mb-3">
    🎯 Select Training Program
  </label>
  <select
    value={selectedCourse}
    onChange={handleCourseChange}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
    disabled={isCoursePreselected} // disables the dropdown
  >
    <option value="">-- Choose a Training Program --</option>
    {courses.map((course) => (
      <option key={course._id} value={course._id}>
        {course.title}
      </option>
    ))}
  </select>
</div>


        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading...</p>
          </div>
        )}

        {/* Curriculum Structure */}
        {!loading && phases.length > 0 && (
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div
                key={phase._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
              >
                {/* Phase Header */}
                <div
                  onClick={() => setOpenPhase(openPhase === phase._id ? null : phase._id)}
                  className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{phase.title}</h3>
                      <p className="text-gray-600">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPhase(phase);
                      }}
                      className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhase(phase);
                      }}
                      className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      🗑️
                    </button>
                    <span className="text-2xl text-blue-600">
                      {openPhase === phase._id ? "🔽" : "▶️"}
                    </span>
                  </div>
                </div>

                {/* Weeks Section */}
                {openPhase === phase._id && phase.weeks && phase.weeks.length > 0 && (
                  <div className="p-6 bg-gray-50 space-y-4">
                    {phase.weeks.map((week) => (
                      <div
                        key={week._id}
                        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
                      >
                        {/* Week Header */}
                        <div
                          onClick={() =>
                            setOpenWeek(openWeek === week._id ? null : week._id)
                          }
                          className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                              📅
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                Week {week.weekNumber}: {week.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {week.chapters?.length || 0} chapters
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditWeek(week);
                              }}
                              className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWeek(week);
                              }}
                              className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all text-sm"
                            >
                              🗑️
                            </button>
                            <span className="text-2xl text-blue-600">
                              {openWeek === week._id ? "🔽" : "▶️"}
                            </span>
                          </div>
                        </div>

                        {/* Chapters Section */}
                        {openWeek === week._id && (
                          <div className="p-4 bg-white space-y-3">
                            {week.chapters && week.chapters.length > 0 ? (
                              <>
                                {week.chapters.map((chapter, index) => (
                                  <div
                                    key={chapter._id}
                                    className="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 transition-all"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm mt-1">
                                          📚
                                        </div>
                                        <div className="flex-1">
                                          <h5 className="font-semibold text-gray-800 mb-2">
                                            {chapter.title ||
                                              `Chapter ${index + 1}`}
                                          </h5>
                                          <div className="space-y-2">
                                            {chapter.points?.map(
                                              (point, pointIndex) => (
                                                <div
                                                  key={point._id || pointIndex}
                                                  className="flex items-start gap-2 text-sm"
                                                >
                                                  <span className="text-green-500 mt-1">
                                                    ✅
                                                  </span>
                                                  <div>
                                                    <span className="font-medium text-gray-700">
                                                      {point.title}
                                                    </span>
                                                    {point.description && (
                                                      <p className="text-gray-600 text-xs mt-1">
                                                        {point.description}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            handleEditChapter(chapter)
                                          }
                                          className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all text-sm"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteChapter(chapter)
                                          }
                                          className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all text-sm"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Add Chapter Button - At the bottom of chapters section */}
                                {/* <div className="flex justify-center pt-4">
                                  <button
                                    onClick={() =>
                                      navigate(`/admin/add-curriculum?weekId=${week._id}`)
                                    }
                                    className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all flex items-center gap-2"
                                  >
                                    📚 Add Chapter to this Sub-topics
                                  </button>
                                </div> */}

                                {/* Add Chapter Button */}
<div className="flex justify-center pt-4">
  <button
    onClick={() =>
      navigate(
        `/admin/add-curriculum?type=chapter&weekId=${week._id}&courseId=${selectedCourse}`
      )
    }
    className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all flex items-center gap-2"
  >
    📚 Add Chapter to this Sub-topic
  </button>
</div>


                              </>
                            ) : (
                              /* Empty chapters state with add button */
                              <div className="text-center py-8">
                                <div className="text-4xl mb-3">📚</div>
                                <p className="text-gray-500 mb-4">
                                  No chapters yet in this Sub-topic.
                                </p>
                                <button
                                  onClick={() =>
                                    navigate(`/admin/add-curriculum?weekId=${week._id}`)
                                  }
                                  className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all flex items-center gap-2 mx-auto"
                                >
                                  📚 Add First Chapter
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Week Button - Only once at the bottom of weeks section */}
                    {/* <div className="flex justify-center pt-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/add-curriculum?phaseId=${phase._id}`)
                        }
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                      >
                        ➕ Add Sub-Topic to this Topic
                      </button>
                    </div> */}

                    {/* Add Week Button */}
<div className="flex justify-center pt-4">
  <button
    onClick={() =>
      navigate(
        `/admin/add-curriculum?type=week&phaseId=${phase._id}&courseId=${selectedCourse}`
      )
    }
    className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
  >
    ➕ Add Sub-Topic to this Topic
  </button>
</div>


                  </div>
                )}
              </div>
            ))}
            
            {/* Add Phase Button - Only once at the bottom of all phases */}
            {/* <div className="flex justify-center pt-6">
              <button
                onClick={() =>
                  navigate(`/admin/add-curriculum?courseId=${selectedCourse}`)
                }
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 text-lg"
              >
                🏗️ Add New Topic
              </button>
            </div> */}

            <div className="flex justify-center pt-6">
  <button
    onClick={() =>
      navigate(`/admin/add-curriculum?type=phase&courseId=${selectedCourse}`)
    }
    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 text-lg"
  >
    🏗️ Add New Topic
  </button>
</div>

          </div>
        )}

        {/* Empty State */}
        {!loading && selectedCourse && phases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Curriculum Found
            </h3>
            <p className="text-gray-500 mb-6">
              This training program doesn't have any curriculum yet.
            </p>
            <button
              onClick={() => navigate(`/admin/add-curriculum?courseId=${selectedCourse}`)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              🚀 Create Curriculum
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && !selectedCourse && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select a Training Program
            </h3>
            <p className="text-gray-500">
              Choose a training program from the dropdown above to manage its curriculum.
            </p>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Modal */}
        {modal && (
          <Modal
            title={modal.title}
            values={modal.values}
            onSave={modal.onSave}
            onClose={() => setModal(null)}
            type={modal.type}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCurriculum;