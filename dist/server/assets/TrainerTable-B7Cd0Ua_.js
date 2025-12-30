import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { d as DIR, e as canPerformAction, S as ScrollableTable, M as Modal } from "../entry-server.js";
import { f as fetchAllTrainers, d as deleteTrainer } from "./trainerApi-uqZoQf46.js";
import { useSelector } from "react-redux";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const displayValue = (value, fallback = "N/A") => {
  if (value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0) {
    return fallback;
  }
  return value;
};
const isValidResume = (resume) => {
  return resume && typeof resume === "string" && resume.trim() !== "" && resume !== "N/A" && resume !== "NA" && resume !== "null" && resume !== "undefined";
};
const TrainerTable = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const loadTrainers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllTrainers();
      const cleanedData = data.map((trainer) => ({
        ...trainer,
        fullName: trainer.fullName ?? null,
        title: trainer.title ?? null,
        email: trainer.email ?? null,
        mobileNo: trainer.mobileNo ?? null,
        highestQualification: trainer.highestQualification ?? null,
        totalExperience: trainer.totalExperience ?? null,
        resume: trainer.resume ?? null,
        profilePhotoTrainer: trainer.profilePhotoTrainer ?? null
      }));
      setTrainers(cleanedData);
    } catch (err) {
      console.error("Failed to fetch trainers:", err);
      setError("Failed to fetch trainers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTrainers();
  }, []);
  const handleDelete = async (trainerId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the trainer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fefefe"
    });
    if (result.isConfirmed) {
      try {
        await deleteTrainer(trainerId);
        await loadTrainers();
        Swal.fire({
          title: "Deleted!",
          text: "Trainer has been removed successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error deleting trainer:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete trainer.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      }
    }
  };
  const handleView = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
  };
  const columns = useMemo(
    () => [
      {
        header: "Profile",
        accessor: (row) => row.profilePhotoTrainer ? /* @__PURE__ */ jsx(
          "img",
          {
            src: `${DIR.TRAINER_PROFILE_PHOTO}${row.profilePhotoTrainer}`,
            alt: row.fullName,
            className: "w-12 h-12 rounded-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500", children: "N/A" })
      },
      { header: "Name", accessor: (row) => displayValue(row.fullName) },
      { header: "Title", accessor: (row) => displayValue(row.title) },
      {
        header: "Qualification",
        accessor: (row) => displayValue(row.highestQualification)
      },
      {
        header: "Experience",
        accessor: (row) => row.totalExperience ? `${row.totalExperience} yrs` : "N/A"
      },
      {
        header: "Email",
        accessor: (row) => row.email ? /* @__PURE__ */ jsx(
          "a",
          {
            href: `mailto:${row.email}`,
            className: "text-blue-600 hover:underline",
            children: row.email
          }
        ) : "N/A"
      },
      {
        header: "Mobile No",
        accessor: (row) => displayValue(row.mobileNo)
      },
      {
        header: "Resume",
        accessor: (row) => isValidResume(row.resume) ? /* @__PURE__ */ jsx(
          "a",
          {
            href: `${DIR.TRAINER_RESUME}${row.resume}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-700 underline text-sm",
            download: true,
            children: "Download"
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "N/A" })
      },
      {
        header: "Actions",
        accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleView(row),
              className: "p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600",
              title: "View Trainer Details",
              children: /* @__PURE__ */ jsx(FaEye, {})
            }
          ),
          canPerformAction(rolePermissions, "trainer", "update") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(`/trainers/update/${row._id}`),
              className: "p-2 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600",
              children: /* @__PURE__ */ jsx(FaPencilAlt, {})
            }
          ),
          canPerformAction(rolePermissions, "trainer", "delete") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(row._id),
              className: "p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600",
              children: "🗑️"
            }
          )
        ] })
      }
    ],
    [navigate, rolePermissions]
  );
  return /* @__PURE__ */ jsxs("div", { className: "max-h-screen p-2 bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "px-6 py-5 bg-blue-50 border-b border-blue-200 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-blue-900 tracking-tight", children: "Trainer Management" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/trainer-register"),
            className: "px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition",
            children: "Register Trainer"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-2", children: loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600 text-lg animate-pulse py-12", children: "Loading trainers..." }) : error ? /* @__PURE__ */ jsx("p", { className: "text-center text-red-500 text-lg py-12", children: error }) : trainers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 italic text-lg py-12", children: "No trainers found." }) : /* @__PURE__ */ jsx(
        ScrollableTable,
        {
          columns,
          data: trainers,
          maxHeight: "500px"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        header: "Trainer Details",
        children: selectedTrainer ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-5 pb-4 border-b border-gray-200", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: selectedTrainer.profilePhotoTrainer ? `${DIR.TRAINER_PROFILE_PHOTO}${selectedTrainer.profilePhotoTrainer}` : "https://via.placeholder.com/80",
                alt: selectedTrainer.fullName,
                className: "w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900", children: selectedTrainer.fullName }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: selectedTrainer.title })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Email:" }),
              " ",
              selectedTrainer.email ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: `mailto:${selectedTrainer.email}`,
                  className: "text-blue-600 hover:underline",
                  children: selectedTrainer.email
                }
              ) : "N/A"
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Mobile:" }),
              " ",
              displayValue(selectedTrainer.mobileNo)
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Qualification:" }),
              " ",
              displayValue(selectedTrainer.highestQualification)
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Experience:" }),
              " ",
              selectedTrainer.totalExperience ? `${selectedTrainer.totalExperience} years` : "N/A"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-200", children: [
            /* @__PURE__ */ jsx("strong", { children: "Resume:" }),
            " ",
            isValidResume(selectedTrainer.resume) ? /* @__PURE__ */ jsx(
              "a",
              {
                href: `${DIR.TRAINER_RESUME}${selectedTrainer.resume}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-600 hover:text-blue-800 underline text-sm font-medium",
                download: true,
                children: "Download Resume"
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 ml-2", children: "N/A" })
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 italic py-8", children: "No trainer selected." })
      }
    )
  ] });
};
export {
  TrainerTable as default
};
