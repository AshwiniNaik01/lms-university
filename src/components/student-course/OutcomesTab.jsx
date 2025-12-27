
import { useState } from "react";
import {
  FaCode,
  FaGraduationCap,
  FaLightbulb,
  FaPlay,
  FaRocket,
  FaStar,
  FaTrophy,
  FaUsers
} from "react-icons/fa";

const OutcomesTab = ({ course }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [progress, setProgress] = useState(0);

  // Simulate progress based on completed outcomes
  const outcomesWithProgress = course.learningOutcomes?.map((outcome, index) => ({
    id: index,
    text: outcome,
    completed: Math.random() > 0.7, // Random completion for demo
    category: getOutcomeCategory(outcome),
    // skills: extractSkills(outcome),
    icon: getOutcomeIcon(outcome)
  })) || [];

  const completedCount = outcomesWithProgress.filter(outcome => outcome.completed).length;
  const totalCount = outcomesWithProgress.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  function getOutcomeCategory(outcome) {
    const lowerOutcome = outcome.toLowerCase();
    if (lowerOutcome.includes('build') || lowerOutcome.includes('develop') || lowerOutcome.includes('create')) 
      return 'development';
    if (lowerOutcome.includes('master') || lowerOutcome.includes('understand') || lowerOutcome.includes('learn')) 
      return 'mastery';
    if (lowerOutcome.includes('deploy') || lowerOutcome.includes('production') || lowerOutcome.includes('launch')) 
      return 'deployment';
    if (lowerOutcome.includes('crack') || lowerOutcome.includes('interview') || lowerOutcome.includes('job')) 
      return 'career';
    return 'general';
  }



  function getOutcomeIcon(outcome) {
    const category = getOutcomeCategory(outcome);
    switch (category) {
      case 'development': return FaCode;
      case 'mastery': return FaGraduationCap;
      case 'deployment': return FaRocket;
      case 'career': return FaUsers;
      default: return FaLightbulb;
    }
  }

  const categoryColors = {
    development: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600', light: 'bg-blue-50' },
    mastery: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600', light: 'bg-purple-50' },
    deployment: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600', light: 'bg-green-50' },
    career: { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', light: 'bg-orange-50' },
    general: { bg: 'from-gray-500 to-gray-700', text: 'text-gray-600', light: 'bg-gray-50' }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      development: 'Development',
      mastery: 'Mastery',
      deployment: 'Deployment',
      career: 'Career',
      general: 'General'
    };
    return labels[category] || 'Skill';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border p-4 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
            <FaTrophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Outcomes</h1>
            <p className="text-gray-600 mt-1 text-lg">
              Master these skills to become a proficient {course.title} developer
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 text-center">
            <div className="text-3xl font-bold text-green-600">{totalCount}</div>
            <div className="text-green-700 font-medium">Total Outcomes</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-6 border border-blue-200 text-center">
            <div className="text-3xl font-bold text-blue-600">{completedCount}</div>
            <div className="text-blue-700 font-medium">Completed</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200 text-center">
            <div className="text-3xl font-bold text-purple-600">{progressPercentage}%</div>
            <div className="text-purple-700 font-medium">Overall Progress</div>
          </div>
        </div> */}

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">Your Learning Journey</div>
            <div className="text-sm font-bold text-green-600">{progressPercentage}% Complete</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Master</span>
          </div>
        </div>
      </div>

      {/* Outcomes Grid */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaGraduationCap className="text-purple-600" />
            What You'll Master
          </h2>
          <p className="text-gray-600 mt-1">
            {totalCount} key skills and competencies you'll develop
          </p>
        </div>

        <div className="p-6">
          {outcomesWithProgress.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {outcomesWithProgress.map((outcome, index) => {
                const IconComponent = outcome.icon;
                const colors = categoryColors[outcome.category];
                
                return (
                  <div
                    key={outcome.id}
                    className={`border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${
                      outcome.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                    // onClick={() => setSelectedOutcome(outcome)}
                  >
                    <div className="p-3">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 bg-gradient-to-r ${colors.bg} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className={`text-xl font-semibold mb-2 group-hover:${colors.text} transition-colors ${
                                outcome.completed ? 'text-green-700' : 'text-gray-900'
                              }`}>
                                {outcome.text}
                              </h3>
                              
                              {/* Category Badge */}
                              
                            </div>

                            {/* Status Indicator */}
                            
                          </div>

                          {/* Skills Tags */}
                         

                          {/* Progress for individual outcome */}
                         
                        </div>

                       
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGraduationCap className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Learning Outcomes Defined
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Learning outcomes for this course will be added by the instructor soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action
    

      {/* Outcome Detail Modal */}
      {selectedOutcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className={`p-6 border-b bg-gradient-to-r ${categoryColors[selectedOutcome.category].bg} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedOutcome.icon className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Learning Outcome</h3>
                </div>
                <button
                  // onClick={() => setSelectedOutcome(null)}
                  className="text-white hover:text-gray-200 transition-colors p-2"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">{selectedOutcome.text}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Category</div>
                      <div className="font-semibold text-gray-900">{getCategoryLabel(selectedOutcome.category)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`font-semibold ${
                        selectedOutcome.completed ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {selectedOutcome.completed ? 'Mastered' : 'In Progress'}
                      </div>
                    </div>
                  </div>

                  {selectedOutcome.skills.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Key Skills Developed</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedOutcome.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium"
                          >
                            <FaStar className="w-4 h-4 text-yellow-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

               
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Outcome {selectedOutcome.id + 1} of {totalCount}
              </div>
              <div className="flex gap-3">
                <button
                  // onClick={() => setSelectedOutcome(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaPlay className="w-4 h-4" />
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutcomesTab;