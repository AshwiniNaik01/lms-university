// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollableDiv = document.getElementById("main-scroll-container");

    if (scrollableDiv) {
      scrollableDiv.scrollTo({
        top: 0,
        behavior: "smooth", // or "auto" if you want instant scroll
      });
    }
  }, [pathname]);

  return null;
}
