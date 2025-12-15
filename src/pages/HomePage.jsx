import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

// SLIDER IMPORTS
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import "./HomePage.css"; // Aapki CSS file

// --- Components ---
const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card-wrapper">
    <div className="testimonial-card">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="testimonial-avatar"
      />
      <p>"{testimonial.feedback}"</p>
      <span className="testimonial-name">- {testimonial.name}</span>
    </div>
  </div>
);

// --- FAQ Accordion Component ---
const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  const itemVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <div className="faq-item">
      <motion.div
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        {faq.question}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>▼</motion.span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="faq-answer"
            variants={itemVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Data ---

// Courses Field Data
const featuredCourses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    desc: "Master MERN stack and build real-world projects.",
    img: "/images/web_design.jpg",
  },
  {
    id: 2,
    title: "Data Science Bootcamp",
    desc: "Learn Python, ML, and Data Analytics from scratch.",
    img: "/images/data_science.webp",
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    desc: "Grow your brand with effective online strategies.",
    img: "/images/digital_marketing.jpg",
  },
];

// Testimonial Data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    feedback:
      "This LMS changed my life! The teachers are super helpful and content is up-to-date.",
    avatar: "/images/students/priya.jpg",
  },
  {
    id: 2,
    name: "Rahul Verma",
    feedback:
      "I got my first job after completing the Full Stack course here. Highly recommend!",
    avatar: "/images/students/rahul.jpg",
  },
  {
    id: 3,
    name: "Sunita Kaur",
    feedback:
      "The flexible learning schedule helped me a lot. The courses are amazing!",
    avatar: "/images/students/sunita.jpg",
  },
];

// --- FAQ Data ---
const faqs = [
  {
    id: 1,
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes, upon successful completion of any course, you will receive a verifiable certificate from Code Drift's LMS to showcase your new skills.",
  },
  {
    id: 2,
    question: "Can I access courses on my mobile device?",
    answer:
      "Absolutely! Our platform is fully responsive, allowing you to learn on the go from your mobile, tablet, or desktop.",
  },
  {
    id: 3,
    question: "What are the payment options available?",
    answer:
      "We accept all major credit cards, debit cards, and UPI payments through a secure payment gateway.",
  },
  {
    id: 4,
    question: "Is there a trial period for courses?",
    answer:
      "We don't offer a trial period, but many of our courses have a free preview of the first few lessons, so you can decide if the course is right for you.",
  },
];

// --- Main HomePage Component ---

const HomePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`);
    }
  };

  // Slider settings
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    fade: true,
    cssEase: "linear",
  };

  // Animation variants
  const heroContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // const sectionVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.6, ease: "easeOut" },
  //   },
  // };
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  return (
    <div className="homepage">
      {/* Background Video Section */}

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/images/opening-book.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Unlock Your Potential with Code Drift's LMS
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-2xl mb-6"
          >
            Your premier destination for quality online education, tailored to
            your learning journey.
          </motion.p>

          {/* <motion.form
  variants={itemVariants}
  onSubmit={handleSearch}
  className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-xl bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg"
>
  <input
    type="text"
    className="flex-1 px-4 py-2 rounded-md shadow-md text-white bg-white/20 placeholder-white placeholder-opacity-80 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    placeholder="What do you want to learn today?"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button
    type="submit"
    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 transition"
  >
    Search
  </button>
</motion.form> */}

          <motion.div
            variants={itemVariants}
            className="flex gap-4 flex-wrap justify-center"
          >
            {/* Explore Courses Button */}
            {/* <Link
              to="/courses"
              className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-200"
            >
              Explore Courses
            </Link> */}

            {/* Conditional Buttons based on authentication & role */}
            {!currentUser && (
              <Link
                to="/"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700"
              >
                Get Started
              </Link>
            )}
            {currentUser && !isAdmin && (
              <Link
                to="/student/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700"
              >
                My Dashboard
              </Link>
            )}
            {currentUser && isAdmin && (
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700"
              >
                Admin Panel
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#485dac] mb-8">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-l-4 border-[#53b8ec] bg-[#f0f9ff] rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold mb-2">Expert Instructors</h3>
              <p>Courses taught by professionals from the industry.</p>
            </div>
            <div className="p-6 border-l-4 border-[#e9577c] bg-[#fff5f7] rounded-lg shadow-sm">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold mb-2">Flexible Learning</h3>
              <p>Access anytime, from anywhere, on any device.</p>
            </div>
            <div className="p-6 border-l-4 border-[#C7DA40] bg-[#fafff1] rounded-lg shadow-sm">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="font-semibold mb-2">Career Focused</h3>
              <p>Get certified and upgrade your resume instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS SECTION UPDATED ===== */}
      <motion.section
        className="stats-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">100+</h3>
              <p className="stat-label">Happy Students</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">15+</h3>
              <p className="stat-label">Expert Courses</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">5+</h3>
              <p className="stat-label">Instructors</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">95%</h3>
              <p className="stat-label">Completion Rate</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-[#e3ebc5] via-[#c4ddea] to-[#eec4cf]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-[#53B8EC] via-[#485DAC] to-[#E9577C] text-transparent bg-clip-text">
            Featured Courses
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-4 border-[#abb9ec] hover:border-[#E9577C] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-52 object-cover border-b-2 border-[#c0d3f1]"
                />
                <div className="p-6 text-left">
                  <h4 className="text-2xl font-bold text-[#485DAC] mb-2">
                    {course.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {course.desc}
                  </p>
                  <Link
                    to="/courses"
                    className="text-[#E9577C] font-semibold inline-block hover:text-[#c94464] transition"
                  >
                    View Course →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-[#dde0bd] via-[#bae4ea] to-[#e3aeb8] py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-[#485dac] mb-10">
          What Our Students Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <Slider {...testimonialSettings}>
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </Slider>
        </div>
      </section>

      {/* FAQ Section */}
      <motion.section
        className="faq-section bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6 md:px-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800 drop-shadow">
            🤔 Frequently Asked Questions
          </h2>

          <div className="flex flex-col items-center gap-2">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="faq-item w-full max-w-6xl bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4"
                variants={sectionVariants}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-gray-600 rounded-full shadow-lg ring-2 ring-yellow-200 animate-pulse">
                      <span className="text-2xl">💡</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <FAQItem faq={faq} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="cta-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>
            Join thousands of students who are transforming their lives through
            education.
          </p>
          <Link
            to={currentUser ? "/courses" : "/register"}
            className="button button-cta"
          >
            {currentUser ? "Browse More Courses" : "Sign Up Today"}
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
