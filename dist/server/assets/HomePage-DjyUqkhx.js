import { jsxs, jsx } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { u as useAuth } from "../entry-server.js";
import Slider from "react-slick";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "react-redux";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const TestimonialCard = ({ testimonial }) => /* @__PURE__ */ jsx("div", { className: "testimonial-card-wrapper", children: /* @__PURE__ */ jsxs("div", { className: "testimonial-card", children: [
  /* @__PURE__ */ jsx(
    "img",
    {
      src: testimonial.avatar,
      alt: testimonial.name,
      className: "testimonial-avatar"
    }
  ),
  /* @__PURE__ */ jsxs("p", { children: [
    '"',
    testimonial.feedback,
    '"'
  ] }),
  /* @__PURE__ */ jsxs("span", { className: "testimonial-name", children: [
    "- ",
    testimonial.name
  ] })
] }) });
const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 }
  };
  return /* @__PURE__ */ jsxs("div", { className: "faq-item", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "faq-question",
        onClick: () => setIsOpen(!isOpen),
        whileHover: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
        children: [
          faq.question,
          /* @__PURE__ */ jsx(motion.span, { animate: { rotate: isOpen ? 180 : 0 }, children: "▼" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "faq-answer",
        variants: itemVariants,
        initial: "closed",
        animate: "open",
        exit: "closed",
        transition: { duration: 0.3, ease: "easeInOut" },
        children: /* @__PURE__ */ jsx("p", { children: faq.answer })
      }
    ) })
  ] });
};
const featuredCourses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    desc: "Master MERN stack and build real-world projects.",
    img: "/images/web_design.jpg"
  },
  {
    id: 2,
    title: "Data Science Bootcamp",
    desc: "Learn Python, ML, and Data Analytics from scratch.",
    img: "/images/data_science.webp"
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    desc: "Grow your brand with effective online strategies.",
    img: "/images/digital_marketing.jpg"
  }
];
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    feedback: "This LMS changed my life! The teachers are super helpful and content is up-to-date.",
    avatar: "/images/students/priya.jpg"
  },
  {
    id: 2,
    name: "Rahul Verma",
    feedback: "I got my first job after completing the Full Stack course here. Highly recommend!",
    avatar: "/images/students/rahul.jpg"
  },
  {
    id: 3,
    name: "Sunita Kaur",
    feedback: "The flexible learning schedule helped me a lot. The courses are amazing!",
    avatar: "/images/students/sunita.jpg"
  }
];
const faqs = [
  {
    id: 1,
    question: "Do I get a certificate after completing a course?",
    answer: "Yes, upon successful completion of any course, you will receive a verifiable certificate from Code Drift's LMS to showcase your new skills."
  },
  {
    id: 2,
    question: "Can I access courses on my mobile device?",
    answer: "Absolutely! Our platform is fully responsive, allowing you to learn on the go from your mobile, tablet, or desktop."
  },
  {
    id: 3,
    question: "What are the payment options available?",
    answer: "We accept all major credit cards, debit cards, and UPI payments through a secure payment gateway."
  },
  {
    id: 4,
    question: "Is there a trial period for courses?",
    answer: "We don't offer a trial period, but many of our courses have a free preview of the first few lessons, so you can decide if the course is right for you."
  }
];
const HomePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4e3,
    arrows: true,
    fade: true,
    cssEase: "linear"
  };
  const heroContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "homepage", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative w-full h-[90vh] overflow-hidden", children: [
      /* @__PURE__ */ jsxs(
        "video",
        {
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          className: "absolute top-0 left-0 w-full h-full object-cover z-[-1]",
          children: [
            /* @__PURE__ */ jsx("source", { src: "/images/opening-book.mp4", type: "video/mp4" }),
            "Your browser does not support the video tag."
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 z-0" }),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4",
          variants: heroContentVariants,
          initial: "hidden",
          animate: "visible",
          children: [
            /* @__PURE__ */ jsx(
              motion.h1,
              {
                variants: itemVariants,
                className: "text-4xl md:text-6xl font-bold mb-4",
                children: "Unlock Your Potential with Code Drift's LMS"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                variants: itemVariants,
                className: "text-lg md:text-2xl mb-6",
                children: "Your premier destination for quality online education, tailored to your learning journey."
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: itemVariants,
                className: "flex gap-4 flex-wrap justify-center",
                children: [
                  !currentUser && /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/",
                      className: "bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700",
                      children: "Get Started"
                    }
                  ),
                  currentUser && !isAdmin && /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/student/dashboard",
                      className: "bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700",
                      children: "My Dashboard"
                    }
                  ),
                  currentUser && isAdmin && /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/dashboard",
                      className: "bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700",
                      children: "Admin Panel"
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-[#485dac] mb-8", children: "Why Choose Us?" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-l-4 border-[#53b8ec] bg-[#f0f9ff] rounded-lg shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "🎓" }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Expert Instructors" }),
          /* @__PURE__ */ jsx("p", { children: "Courses taught by professionals from the industry." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-l-4 border-[#e9577c] bg-[#fff5f7] rounded-lg shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "📚" }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Flexible Learning" }),
          /* @__PURE__ */ jsx("p", { children: "Access anytime, from anywhere, on any device." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-l-4 border-[#C7DA40] bg-[#fafff1] rounded-lg shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "💼" }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Career Focused" }),
          /* @__PURE__ */ jsx("p", { children: "Get certified and upgrade your resume instantly." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        className: "stats-section",
        variants: sectionVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "stats-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "stat-item", children: [
            /* @__PURE__ */ jsx("h3", { className: "stat-number", children: "100+" }),
            /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Happy Students" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stat-item", children: [
            /* @__PURE__ */ jsx("h3", { className: "stat-number", children: "15+" }),
            /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Expert Courses" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stat-item", children: [
            /* @__PURE__ */ jsx("h3", { className: "stat-number", children: "5+" }),
            /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Instructors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stat-item", children: [
            /* @__PURE__ */ jsx("h3", { className: "stat-number", children: "95%" }),
            /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Completion Rate" })
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        className: "py-20 bg-gradient-to-br from-[#e3ebc5] via-[#c4ddea] to-[#eec4cf]",
        variants: sectionVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-12 bg-gradient-to-r from-[#53B8EC] via-[#485DAC] to-[#E9577C] text-transparent bg-clip-text", children: "Featured Courses" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-10 md:grid-cols-2 lg:grid-cols-3", children: featuredCourses.map((course) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              whileHover: { scale: 1.03 },
              transition: { duration: 0.3 },
              className: "bg-white border-4 border-[#abb9ec] hover:border-[#E9577C] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: course.img,
                    alt: course.title,
                    className: "w-full h-52 object-cover border-b-2 border-[#c0d3f1]"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "p-6 text-left", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-[#485DAC] mb-2", children: course.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-4 leading-relaxed", children: course.desc }),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/courses",
                      className: "text-[#E9577C] font-semibold inline-block hover:text-[#c94464] transition",
                      children: "View Course →"
                    }
                  )
                ] })
              ]
            },
            course.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "bg-gradient-to-r from-[#dde0bd] via-[#bae4ea] to-[#e3aeb8] py-16 px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-[#485dac] mb-10", children: "What Our Students Say" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsx(Slider, { ...testimonialSettings, children: testimonials.map((t) => /* @__PURE__ */ jsx(TestimonialCard, { testimonial: t }, t.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        className: "faq-section bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6 md:px-20",
        variants: sectionVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800 drop-shadow", children: "🤔 Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-2", children: faqs.map((faq) => /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "faq-item w-full max-w-6xl bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4",
              variants: sectionVariants,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 flex items-center justify-center bg-gray-500 text-gray-600 rounded-full shadow-lg ring-2 ring-yellow-200 animate-pulse", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "💡" }) }) }),
                /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(FAQItem, { faq }) })
              ] })
            },
            faq.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        className: "cta-section",
        variants: sectionVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        children: /* @__PURE__ */ jsxs("div", { className: "cta-content", children: [
          /* @__PURE__ */ jsx("h2", { children: "Ready to Start Learning?" }),
          /* @__PURE__ */ jsx("p", { children: "Join thousands of students who are transforming their lives through education." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: currentUser ? "/courses" : "/register",
              className: "button button-cta",
              children: currentUser ? "Browse More Courses" : "Sign Up Today"
            }
          )
        ] })
      }
    )
  ] });
};
export {
  HomePage as default
};
