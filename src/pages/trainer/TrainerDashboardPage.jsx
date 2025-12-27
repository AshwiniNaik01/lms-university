import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  FaAward,
  FaBookOpen,
  FaBriefcase,
  FaCalendarAlt,
  FaCertificate,
  FaChalkboardTeacher,
  FaChartLine,
  FaClipboardList,
  FaEdit,
  FaEnvelope,
  FaFilePdf,
  FaGraduationCap,
  FaIdCard,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { COURSE_NAME, DIR } from "../../utils/constants";
import { fetchTrainerById } from "../admin/trainer-management/trainerApi";

// ===============================================
// Trainer Dashboard Page Component
// ===============================================



const cleanValue = (value) => {
  if (
    value === "NA" ||
    value === "" ||
    value === "null" ||
    value === null ||
    value === undefined
  ) {
    return "";
  }
  return value;
};

const cleanArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (v) => v && v !== "NA" && v !== "null" && v !== ""
  );
};

const normalizeTrainer = (data) => ({
  ...data,

  fullName: cleanValue(data.fullName),
  title: cleanValue(data.title),
  email: cleanValue(data.email),
  mobileNo: cleanValue(data.mobileNo),
  dob: cleanValue(data.dob),
  gender: cleanValue(data.gender),
  highestQualification: cleanValue(data.highestQualification),
  totalExperience: cleanValue(data.totalExperience),
  resume: cleanValue(data.resume),
  availableTiming: cleanValue(data.availableTiming),
  linkedinProfile: cleanValue(data.linkedinProfile),
  summary: cleanValue(data.summary),
  collegeName: cleanValue(data.collegeName),
  profilePhotoTrainer: cleanValue(data.profilePhotoTrainer),
  idProofTrainer: cleanValue(data.idProofTrainer),

  address: {
    add1: cleanValue(data.address?.add1),
    add2: cleanValue(data.address?.add2),
    taluka: cleanValue(data.address?.taluka),
    dist: cleanValue(data.address?.dist),
    state: cleanValue(data.address?.state),
    pincode: cleanValue(data.address?.pincode),
  },

  certifications: cleanArray(data.certifications),
  achievements: cleanArray(data.achievements),
  skills: cleanArray(data.skills),
  courses: cleanArray(data.courses),
  batches: cleanArray(data.batches),
});


const TrainerDashboardPage = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch trainer data using ID from cookie
  // useEffect(() => {
  //   const fetchTrainer = async () => {
  //     try {
  //       const trainerId = Cookies.get("trainerId");
  //       if (!trainerId) return;

  //       // Use centralized API utility
  //       const trainerData = await fetchTrainerById(trainerId);

  //       // Set the fetched data into local state
  //       setTrainer(trainerData);
  //     } catch (error) {
  //       console.error("❌ Failed to fetch trainer data:", error);
  //     } finally {
  //       // Ensure loading is disabled even if an error occurs
  //       setLoading(false);
  //     }
  //   };

  //   fetchTrainer();
  // }, []);


  useEffect(() => {
  const fetchTrainer = async () => {
    try {
      const trainerId = Cookies.get("trainerId");
      if (!trainerId) return;

      const response = await fetchTrainerById(trainerId);

      // 👇 normalize here
      const normalizedTrainer = normalizeTrainer(response.data || response);

      setTrainer(normalizedTrainer);
    } catch (error) {
      console.error("❌ Failed to fetch trainer data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTrainer();
}, []);


  // Handle loader during async operations
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Trainer Profile...
          </p>
        </div>
      </div>
    );
  }

  // Show error UI when trainer is not found
  if (!trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Trainer Not Found</h2>
          <p className="text-gray-500 mt-2">
            We couldn't find your trainer profile.
          </p>
        </div>
      </div>
    );
  }

  // Dashboard components

  // Profile Header
  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path
            fill="currentColor"
            d="M45,-78.3C58.5,-69.8,69.4,-57.1,78.1,-42.4C86.8,-27.6,93.4,-10.9,92.9,5.9C92.4,22.6,84.8,39.4,73.1,52.2C61.4,65,45.6,73.9,29.1,78.7C12.6,83.5,-4.6,84.2,-20.8,80.1C-37,76,-52.2,67.1,-63.6,54.5C-75,41.9,-82.6,25.6,-83.9,8.7C-85.2,-8.2,-80.2,-25.6,-70.7,-39.6C-61.2,-53.6,-47.2,-64.2,-32.2,-72.1C-17.2,-80,-1.1,-85.2,14.2,-83.8C29.5,-82.4,44,-74.4,45,-78.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="relative">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
            {trainer.profilePhotoTrainer ? (
              <img
                src={`${DIR.TRAINER_PROFILE_PHOTO}${trainer.profilePhotoTrainer}`}
                alt="Trainer Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <FaUser className="w-12 h-12 text-white/70" />
            )}
          </div>
          <div
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
              trainer.isActive ? "bg-green-400" : "bg-gray-400"
            }`}
          ></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {trainer.fullName}
          </h1>
          <p className="text-indigo-100 mb-3">
            {trainer.title || "Professional Trainer"}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                trainer.isApproved
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {trainer.approvalStatus}
            </span>
            <span className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full">
              <FaStar className="text-yellow-400" />
              <span>4.8 Rating</span>
            </span>
            <span className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full">
              <FaUsers className="text-indigo-300" />
              <span>250+ Participate</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md">
            <FaEnvelope className="w-5 h-5" />
          </button>
          <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md">
            <FaPhone className="w-5 h-5" />
          </button>
          <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md">
            <FaEdit className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Information Cards for dashboard
  const InfoCard = ({ title, icon, children, className = "", action }) => (
    <div
      className={`bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg text-indigo-600">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {action && (
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );

  // Detail Items Component
  const DetailItem = ({ icon, label, value, link }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-indigo-500 mt-1 bg-indigo-50 p-1 rounded-md">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-medium text-sm"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-gray-800 text-sm">
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );

  // The tab buttons for trainer dashboard
  const TabButton = ({ name, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(name.toLowerCase())}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
      }`}
    >
      {icon}
      <span className="font-medium">{name}</span>
    </button>
  );

  // OverView Tab
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <InfoCard
          title="Personal Information"
          icon={<FaUser className="w-5 h-5" />}
          action="Edit"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              icon={<FaEnvelope className="w-3 h-3" />}
              label="Email"
              value={trainer.email}
              link={`mailto:${trainer.email}`}
            />
            <DetailItem
              icon={<FaPhone className="w-3 h-3" />}
              label="Mobile"
              value={trainer.mobileNo}
              link={`tel:${trainer.mobileNo}`}
            />
            <DetailItem
              icon={<FaCalendarAlt className="w-3 h-3" />}
              label="Date of Birth"
              value={trainer.dob || "Not provided"}
            />
            <DetailItem
              icon={<FaUser className="w-3 h-3" />}
              label="Gender"
              value={trainer.gender}
            />
            <DetailItem
              icon={<FaGraduationCap className="w-3 h-3" />}
              label="Highest Qualification"
              value={trainer.highestQualification}
            />
            <DetailItem
              icon={<FaBriefcase className="w-3 h-3" />}
              label="Total Experience"
              value={`${trainer.totalExperience} years`}
            />
            {trainer.collegeName && (
              <DetailItem
                icon={<FaGraduationCap className="w-3 h-3" />}
                label="College"
                value={trainer.collegeName}
              />
            )}
            <DetailItem
              icon={<FaLinkedin className="w-3 h-3" />}
              label="LinkedIn"
              value={trainer.linkedinProfile}
              link={trainer.linkedinProfile}
            />
          </div>
        </InfoCard>

        <InfoCard
          title="Certifications"
          icon={<FaCertificate className="w-5 h-5" />}
          action="Add"
        >
          {trainer.certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trainer.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                >
                  <FaCertificate className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-800 truncate">{cert}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <FaCertificate className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p>No certifications added</p>
            </div>
          )}
        </InfoCard>
      </div>

      <div className="space-y-6">
        <InfoCard
          title="Address"
          icon={<FaMapMarkerAlt className="w-5 h-5" />}
          action="Update"
        >
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
            <div className="space-y-2">
              <p className="font-medium text-gray-800 text-sm">
                {trainer.address.add1}
              </p>
              {trainer.address.add2 && (
                <p className="text-gray-800 text-sm">{trainer.address.add2}</p>
              )}
              <p className="text-gray-600 text-sm">
                {trainer.address.taluka}, {trainer.address.dist}
              </p>
              <p className="text-gray-600 text-sm">
                {trainer.address.state} - {trainer.address.pincode}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100">
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                View on Map
              </button>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Documents"
          icon={<FaFilePdf className="w-5 h-5" />}
          action="Upload"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <FaFilePdf className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <span className="font-medium text-sm block">Resume</span>
                  <span className="text-xs text-gray-500">PDF Document</span>
                </div>
              </div>
              {trainer.resume && (
                <a
                  href={`${DIR.TRAINER_RESUME}${trainer.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-white py-1 px-3 rounded-md border border-indigo-100 shadow-sm"
                >
                  View
                </a>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <FaIdCard className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <span className="font-medium text-sm block">ID Proof</span>
                  <span className="text-xs text-gray-500">Identification</span>
                </div>
              </div>
              {trainer.idProofTrainer && (
                <a
                  href={`${DIR.ID_PROOF_TRAINER}${trainer.idProofTrainer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-white py-1 px-3 rounded-md border border-indigo-100 shadow-sm"
                >
                  View
                </a>
              )}
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );

  // Achievement Tab
  const AchievementsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <InfoCard
          title="Achievements"
          icon={<FaAward className="w-5 h-5" />}
          action="Add New"
        >
          {trainer.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainer.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="p-2 bg-amber-100 rounded-md mt-1">
                    <FaAward className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-gray-800 text-sm">{ach}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-amber-50 rounded-lg border border-amber-100">
              <FaAward className="w-12 h-12 text-amber-200 mx-auto mb-3" />
              <p>No achievements added yet</p>
              <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Add your first achievement
              </button>
            </div>
          )}
        </InfoCard>
      </div>

      <InfoCard
        title="Professional Summary"
        icon={<FaClipboardList className="w-5 h-5" />}
        action="Edit"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-800 leading-relaxed text-sm">
            {trainer.summary ||
              "No professional summary provided. Add a summary to highlight your expertise and teaching philosophy."}
          </p>
        </div>
      </InfoCard>
    </div>
  );

  // Teaching Tab
  const TeachingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <InfoCard
        title="Course Portfolio"
        icon={<FaBookOpen className="w-5 h-5" />}
      >
        <div className="text-center py-6">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <FaChalkboardTeacher className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {trainer.courses.length}
            </div>
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">
            {trainer.courses.length} {COURSE_NAME}
          </h4>
          <p className="text-gray-500 text-sm">Assigned to teach</p>

          <div className="mt-6 space-y-3">
            {trainer.courses.slice(0, 3).map((course, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-sm text-gray-800 truncate">{course}</span>
              </div>
            ))}
            {trainer.courses.length > 3 && (
              <p className="text-indigo-600 text-sm font-medium">
                +{trainer.courses.length - 3} more {COURSE_NAME}
              </p>
            )}
          </div>
        </div>
      </InfoCard>

      <div className="lg:col-span-2 space-y-6">
        <InfoCard
          title="Batch Statistics"
          icon={<FaChartLine className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUsers className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-sm text-gray-600 mt-1">Active Batches</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaAward className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-600 mt-1">Completed Batches</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-violet-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUser className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">250+</p>
              <p className="text-sm text-gray-600 mt-1">Total Participates</p>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Upcoming Sessions"
          icon={<FaCalendarAlt className="w-5 h-5" />}
        >
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
            <FaCalendarAlt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p>No upcoming sessions</p>
            <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Calendar
            </button>
          </div>
        </InfoCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <ProfileHeader />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <TabButton
            name="Overview"
            icon={<FaUser className="w-4 h-4" />}
            isActive={activeTab === "overview"}
          />
          <TabButton
            name="Achievements"
            icon={<FaAward className="w-4 h-4" />}
            isActive={activeTab === "achievements"}
          />
          <TabButton
            name="Teaching"
            icon={<FaChalkboardTeacher className="w-4 h-4" />}
            isActive={activeTab === "teaching"}
          />
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "achievements" && <AchievementsTab />}
          {activeTab === "teaching" && <TeachingTab />}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChalkboardTeacher className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {trainer.courses.length}
            </p>
            <p className="text-sm text-gray-600">{COURSE_NAME}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUsers className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-800">250+</p>
            <p className="text-sm text-gray-600">Participates</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaAward className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {trainer.certifications.length}
            </p>
            <p className="text-sm text-gray-600">Certifications</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaBriefcase className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {trainer.totalExperience}
            </p>
            <p className="text-sm text-gray-600">Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardPage;
