
import { useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaChevronDown,
  FaClock,
  FaTasks,
  FaVideo
} from "react-icons/fa";

const CurriculumTab = ({ course, expandedWeeks, toggleWeek }) => {
  const [expandedPhases, setExpandedPhases] = useState({});

  const togglePhase = (phaseIndex) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex]
    }));
  };

  const getChapterStats = (chapter) => {
    const lectures = chapter.lectures?.length || 0;
    const assignments = chapter.assignments?.length || 0;
    const totalItems = lectures + assignments;
    
    return { lectures, assignments, totalItems };
  };

  const getWeekStats = (week) => {
    let totalLectures = 0;
    let totalAssignments = 0;
    let totalDuration = 0;

    week.chapters?.forEach(chapter => {
      totalLectures += chapter.lectures?.length || 0;
      totalAssignments += chapter.assignments?.length || 0;
      totalDuration += (chapter.lectures?.length || 0) * 30; // 30 mins per lecture
    });

    return {
      lectures: totalLectures,
      assignments: totalAssignments,
      duration: Math.round(totalDuration / 60) // Convert to hours
    };
  };

  const getPhaseStats = (phase) => {
    let totalWeeks = phase.weeks.length;
    let totalChapters = 0;
    let totalLectures = 0;
    let totalAssignments = 0;

    phase.weeks.forEach(week => {
      totalChapters += week.chapters.length;
      week.chapters.forEach(chapter => {
        totalLectures += chapter.lectures?.length || 0;
        totalAssignments += chapter.assignments?.length || 0;
      });
    });

    return { totalWeeks, totalChapters, totalLectures, totalAssignments };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white shadow-lg">
            <FaBook className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Course Curriculum</h2>
            <p className="text-gray-600 mt-1 text-lg">
              Master {course.title} through {course.phases?.length || 0} structured phases
            </p>
          </div>
        </div>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{course.phases?.length || 0}</div>
            <div className="text-sm text-gray-600">Phases</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {course.phases?.reduce((total, phase) => total + phase.weeks.length, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Weeks</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {course.phases?.reduce((total, phase) => 
                total + phase.weeks.reduce((weekTotal, week) => 
                  weekTotal + week.chapters.length, 0), 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Chapters</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {course.phases?.reduce((total, phase) => 
                total + phase.weeks.reduce((weekTotal, week) => 
                  weekTotal + week.chapters.reduce((chapterTotal, chapter) => 
                    chapterTotal + (chapter.lectures?.length || 0), 0), 0), 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Lectures</div>
          </div>
        </div>
      </div>

      {/* Curriculum Content */}
      <div className="p-6 space-y-6">
        {course.phases?.map((phase, phaseIndex) => {
          const isPhaseExpanded = expandedPhases[phaseIndex];
          const phaseStats = getPhaseStats(phase);

          return (
            <div 
              key={phase._id} 
              className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-300 bg-white"
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phaseIndex)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* Phase Number */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {phaseIndex + 1}
                    </div>
                   
                  </div>

                  {/* Phase Info */}
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {phase.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{phase.description}</p>
                    
                    {/* Phase Stats */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                        <FaClock className="w-3 h-3" />
                        {phaseStats.totalWeeks} weeks
                      </span>
                      <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <FaBook className="w-3 h-3" />
                        {phaseStats.totalChapters} chapters
                      </span>
                      <span className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                        <FaVideo className="w-3 h-3" />
                        {phaseStats.totalLectures} lectures
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <div className={`transform transition-transform duration-300 ${
                  isPhaseExpanded ? 'rotate-180' : ''
                } text-gray-400 group-hover:text-purple-500`}>
                  <FaChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Weeks Content - Only show when phase is expanded */}
              {isPhaseExpanded && (
                <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/30">
                  <div className="p-6 space-y-4">
                    {phase.weeks.map((week, weekIndex) => {
                      const key = `${phaseIndex}-${weekIndex}`;
                      const isWeekExpanded = expandedWeeks[key];
                      const weekStats = getWeekStats(week);

                      return (
                        <div 
                          key={week._id} 
                          className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden"
                        >
                          {/* Week Header */}
                          <button
                            onClick={() => toggleWeek(phaseIndex, weekIndex)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-blue-50/50 transition-colors group/week"
                          >
                            <div className="flex items-center gap-4">
                              {/* Week Number */}
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover/week:scale-110 transition-transform">
                                {week.weekNumber}
                              </div>

                              {/* Week Info */}
                              <div className="text-left">
                                <h4 className="text-lg font-semibold text-gray-900 group-hover/week:text-blue-700">
                                  {week.title}
                                </h4>
                                
                                {/* Week Stats */}
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FaBook className="w-3 h-3" />
                                    {week.chapters.length} chapters
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaVideo className="w-3 h-3" />
                                    {weekStats.lectures} lectures
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaTasks className="w-3 h-3" />
                                    {weekStats.assignments} assignments
                                  </span>
                                
                                </div>
                              </div>
                            </div>

                            {/* Expand Icon */}
                            <div className={`transform transition-transform duration-300 ${
                              isWeekExpanded ? 'rotate-180' : ''
                            } text-gray-400 group-hover/week:text-blue-500`}>
                              <FaChevronDown className="w-4 h-4" />
                            </div>
                          </button>

                          {/* Chapters Content - Only show when week is expanded */}
                          {isWeekExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/50">
                              <div className="p-5 space-y-4">
                                {week.chapters.map((chapter, chapterIndex) => {
                                  const chapterStats = getChapterStats(chapter);

                                  return (
                                    <div 
                                      key={chapter._id} 
                                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group/chapter"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          {/* Chapter Header */}
                                          <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                              {chapterIndex + 1}
                                            </div>
                                            <h5 className="text-lg font-semibold text-gray-900 group-hover/chapter:text-green-700">
                                              {chapter.title}
                                            </h5>
                                          </div>

                                          {/* Chapter Stats */}
                                          {chapterStats.totalItems > 0 && (
                                            <div className="flex items-center gap-3 mb-3 text-sm">
                                              {chapterStats.lectures > 0 && (
                                                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                  <FaVideo className="w-3 h-3" />
                                                  {chapterStats.lectures} lecture{chapterStats.lectures !== 1 ? 's' : ''}
                                                </span>
                                              )}
                                              {chapterStats.assignments > 0 && (
                                                <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                  <FaTasks className="w-3 h-3" />
                                                  {chapterStats.assignments} assignment{chapterStats.assignments !== 1 ? 's' : ''}
                                                </span>
                                              )}
                                            </div>
                                          )}

                                          {/* Learning Points */}
                                          {chapter.points?.length > 0 && (
                                            <ul className="space-y-2">
                                              {chapter.points.map((point, pointIndex) => (
                                                <li
                                                  key={point._id}
                                                  className="flex items-start gap-3 text-sm group/point animate-fade-in-up"
                                                  style={{ animationDelay: `${pointIndex * 100}ms` }}
                                                >
                                                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 group-hover/point:scale-110 transition-transform">
                                                    <FaCheckCircle className="w-3 h-3 text-green-500" />
                                                  </div>
                                                  <div className="flex-1">
                                                    <span className="font-medium text-gray-800">
                                                      {point.title}
                                                    </span>
                                                    {point.description && (
                                                      <p className="text-gray-600 text-xs mt-1 bg-gray-50 p-2 rounded-lg">
                                                        {point.description}
                                                      </p>
                                                    )}
                                                  </div>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>

                                        
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="border-t bg-gradient-to-r from-green-50 to-blue-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Your Learning Journey</h4>
            <p className="text-sm text-gray-600">Complete phases to unlock your certificate</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-xs text-gray-500">Overall Progress</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumTab;