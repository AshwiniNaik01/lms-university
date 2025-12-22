import { ImageIcon, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudentById, updateStudentProfile } from "../../api/profile"; // your API calls
// import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/constants";


const StudentProfilePage = () => {
  // const id = "68cbf5ea70a466f62e216a6c"; // hardcoded for now
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    collegeName: "",
    selectedProgram: "",
    profilePhotoStudent: null,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentById(id);
        if (res.success) {
          setStudent(res.data);
          setForm({
            fullName: res.data.fullName || "",
            email: res.data.email || "",
            collegeName: res.data.collegeName || "",
            selectedProgram: res.data.selectedProgram || "",
            profilePhotoStudent: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch Participate", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, profilePhotoStudent: files[0] }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleUpdate = async () => {
  //   setLoading(true);

  //   const formData = new FormData();
  //   formData.append("fullName", form.fullName);
  //   formData.append("email", form.email);
  //   formData.append("collegeName", form.collegeName);
  //   formData.append("selectedProgram", form.selectedProgram);
  //   if (form.profilePhotoStudent) {
  //     formData.append("profilePhotoStudent", form.profilePhotoStudent);
  //   }

  //   try {
  //     const res = await updateStudentProfile(id, formData);
  //     if (res.success) {
  //       setStudent(res.data);
  //       // alert("Profile updated!");
  //       toast.success("Profile updated successfully!");

  //       setIsEditing(false);
  //       setForm((prev) => ({ ...prev, profilePhotoStudent: null }));
  //     }
  //   } catch (err) {
  //     console.error("Update failed", err);
  //     toast.error("Update failed. Please try again.");

  //     // alert("Update failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdate = async () => {
  setLoading(true);

  const formData = new FormData();
  formData.append("fullName", form.fullName);
  formData.append("email", form.email);
  formData.append("collegeName", form.collegeName);
  formData.append("selectedProgram", form.selectedProgram);
  if (form.profilePhotoStudent) {
    formData.append("profilePhotoStudent", form.profilePhotoStudent);
  }

  try {
    const res = await updateStudentProfile(id, formData);
    if (res.success) {
      setStudent(res.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setForm((prev) => ({ ...prev, profilePhotoStudent: null }));
    } else {
      toast.error(res.message || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Update failed", err);
    toast.error("Update failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!student) return <div className="text-center mt-20">Participate not found.</div>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 rounded-xl space-y-8 bg-gradient-to-r from-[#9cc4d7] via-[#8f9fd6] to-[#d997a4] shadow-2xl">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Participate Profile
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded text-white shadow-md font-semibold ${
            isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Profile Photo & Contact & Education Info in one card */}
      <section className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-center">
        {/* Profile Photo */}
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-1/3">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <ImageIcon className="w-5 h-5 text-blue-500" /> Profile Photo
          </h3>
          <img
  src={
    form.profilePhotoStudent
      ? URL.createObjectURL(form.profilePhotoStudent)
      : student.profilePhotoStudent
      ? `${BASE_URL}/uploads/student/student-profilephoto/${student.profilePhotoStudent}`
      : "https://tse4.mm.bing.net/th/id/OIP.s-AC9m7YziZg9lee5VvI-wHaF1?pid=Api&P=0&h=180" // fallback local image
  }
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md mb-4"
/>

          {isEditing && (
            <input
              type="file"
              name="profilePhotoStudent"
              accept="image/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
            />
          )}
        </div>

        {/* Contact & Education Info */}
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-800 mb-4">
            <Mail className="w-5 h-5" /> Contact & Education Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editable when editing */}
            {isEditing ? (
              <>
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                />
                {/* Mobile Number read-only always */}
                <ReadOnlyField label="Mobile Number" value={student.mobileNo || "N/A"} />
                {/* <InputField
                  label="College Name"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleInputChange}
                /> */}
                {/* <InputField
                  label="Selected Program"
                  name="selectedProgram"
                  value={form.selectedProgram}
                  onChange={handleInputChange}
                /> */}
              </>
            ) : (
              <>
                <ReadOnlyField label="Full Name" value={student.fullName || "N/A"} />
                <ReadOnlyField label="Email" value={student.email || "N/A"} />
                <ReadOnlyField label="Mobile Number" value={student.mobileNo || "N/A"} />
                {/* <ReadOnlyField label="College Name" value={student.collegeName || "N/A"} /> */}
                {/* <ReadOnlyField label="Selected Program" value={student.selectedProgram || "N/A"} /> */}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Save Button */}
      {isEditing && (
        <div className="text-end pt-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 border-2 border-black text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

// Read-only display field component
const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <div className="mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 select-none">
      {value}
    </div>
  </div>
);

// Editable input field component
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      type="text"
    />
  </div>
);

export default StudentProfilePage;
