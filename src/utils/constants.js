
// src/utils/constants.js

// Get the base API URL from the environment variable, or default to localhost for development
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Get the current environment setting (e.g., "development", "prod")
const env = import.meta.env.VITE_ENV;
console.log("Current environment:", env);

if (env === "development") {
  console.log("Running in local dev mode");
} else if (env === "prod") {
  console.log("Running in production");
}

// 🌐 Student-facing frontend URL (e.g., public site)
export const STUDENT_PORTAL_URL = (() => {
  switch (env) {
    case "development":
      return "http://localhost:5001/";
    case "uat":
      return "https://uat.codedrift.co/";
    case "prod":
    case "production":
      return "https://codedrift.co/";
    default:
      return "/";
  }
})();

// Export commonly used imaages and notes directory paths for accessing backend file uploads
export const DIR = {
  // 👤 Student
  STUDENT_PHOTO: BASE_URL + "/uploads/student/student-profilephoto/",
  ID_PROOF_STUDENT: BASE_URL + "/uploads/student/student-idproof/",

  // 👨‍🏫 Trainer
  TRAINER_PROFILE_PHOTO: BASE_URL + "/uploads/trainer/trainer-profilephoto/",
  ID_PROOF_TRAINER: BASE_URL + "/uploads/trainer/trainer-idproof/",
  TRAINER_RESUME: BASE_URL + "/uploads/trainer/trainer-resume/",

  // 📘 Course Materials
  COURSE_NOTES: BASE_URL + "/uploads/course-notes/",
  ASSIGNMENT_FILES: BASE_URL + "/uploads/assignments/",

  // 📊 Test Materials
  TEST_EXCEL: BASE_URL + "/uploads/test-excel/",

  // 🎓 Lecture Videos
  LECTURE_CONTENT: BASE_URL + "/uploads/lectures/",

  // 📅 Events
  EVENT_BANNER: BASE_URL + "/uploads/events/banner/",
  EVENT_GALLERY_IMAGE: BASE_URL + "/uploads/events/gallery/",
  EVENT_SPEAKER_PHOTO: BASE_URL + "/uploads/events/speakers/",

  // 📣 Webinars
  WEBINAR_SPEAKER_PHOTO: BASE_URL + "/uploads/webinar/speakers/",

  // 💬 Feedback
  FEEDBACK_PROFILE: BASE_URL + "/uploads/feedback/profiles/",

  // 🏢 Sponsorship
  SPONSOR_LOGO: BASE_URL + "/uploads/sponsorship/logo/",
};