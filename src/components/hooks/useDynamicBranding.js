import { useEffect, useState } from "react";
// import apiClient from "./apiClient"; // your configured axios/fetch instance
// import DIR from "./constants"; // contains DIR.LOGO path
import apiClient from "../../api/axiosConfig";
import { DIR } from "../../utils/constants";


export const useDynamicBranding = () => {
  const [branding, setBranding] = useState({
    companyName: "Code Drift LMS",
    logo: "/images/codedrift-main-logo.png",
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await apiClient.get("/api/contactinfo");
        const data = res.data?.data?.[0];
        if (data) {
          setBranding({
            companyName: data.companyName || "Code Drift LMS",
            logo: data.logo ? `${DIR.LOGO}${data.logo}` : "/images/codedrift-main-logo.png",
          });
        }
      } catch (err) {
        console.error("Failed to load branding info:", err);
      }
    };

    fetchBranding();
  }, []);

  return branding;
};
