import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const useCourseParam = (courses = []) => {
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
export {
  useCourseParam as u
};
