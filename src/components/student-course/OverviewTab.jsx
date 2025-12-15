
import {
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLightbulb,
  FaStar,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { COURSE_NAME } from "../../utils/constants";

const OverviewTab = ({ course, setActiveTab }) => {
  const stats = [
    {
      icon: <FaClock className="w-5 h-5" />,
      label: "Duration",
      value: course.duration,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: "Enrolled",
      value: course.enrolledCount,
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaStar className="w-5 h-5" />,
      label: "Rating",
      value: course.rating,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <FaGraduationCap className="w-5 h-5" />,
      label: "Certificate",
      value: "Included",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    // 🟢 Make content scrollable, assuming header is 64px tall
    <div className="p-8 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Welcome to {course.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {course.overview}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}
            >
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      {course.benefits && course.benefits.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white shadow-lg">
              <FaTrophy className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Why Take This {COURSE_NAME}?
            </h2>
          </div>
          <div className="grid gap-4">
            {course.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mt-1 group-hover:scale-110 transition-transform">
                  <FaCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-lg text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      {course.keyFeatures && course.keyFeatures.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
              <FaLightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">What You'll Get</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {course.keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                )}
                {feature.subPoints && feature.subPoints.length > 0 && (
                  <ul className="space-y-2">
                    {feature.subPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-green-500 mt-1.5">•</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
