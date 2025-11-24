// // hooks/useCourseParam.js
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// export const useCourseParam = (courses = []) => {
//   const location = useLocation();
//   const [selectedCourse, setSelectedCourse] = useState("");

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const courseId = params.get("courseId");

//     // If courseId exists and is in the available courses, pre-select it
//     if (courseId && courses.some((c) => c._id === courseId)) {
//       setSelectedCourse(courseId);
//     }
//   }, [location.search, courses]);

//   return [selectedCourse, setSelectedCourse];
// };


// hooks/useCourseParam.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useCourseParam = (courses = []) => {
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isPreselected, setIsPreselected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get("courseId");

    if (courseId && courses.some((c) => c._id === courseId)) {
      setSelectedCourse(courseId);
      setIsPreselected(true);
    } else {
      setIsPreselected(false);
    }
  }, [location.search, courses]);

  return [selectedCourse, setSelectedCourse, isPreselected];
};
