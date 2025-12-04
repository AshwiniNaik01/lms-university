// apiService.js
// import apiClient from './axiosConfig';

import apiClient from "./axiosConfig";

/**
 * Fetch all phases
 * @returns {Promise<Array>} - List of phases
 */
export const fetchPhases = async () => {
  try {
    const response = await apiClient.get('/api/phases');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching phases:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


/**
 * Create a new phase
 * @param {object} phaseData - The data for the new phase
 * @returns {Promise<object>} - The created phase data
 */
export const createPhase = async (phaseData) => {
  try {
    const response = await apiClient.post('/api/phases', [phaseData]);
    return response.data;
  } catch (error) {
    console.error('Error creating phase:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch all phases for a specific course
 * @param {string} courseId - The course ID to filter phases
 * @returns {Promise<Array>} - List of phases for the given course
 */
// Phases API
export const getPhasesByCourse = async (courseId) => {
  const response = await apiClient.get(`/api/phases/course/${courseId}`);
  return response.data?.data || [];
};

/**
 * Fetch a phase by ID
 * @param {string} phaseId - The ID of the phase to fetch
 * @returns {Promise<object>} - The phase object
 */
export const getPhaseById = async (phaseId) => {
  if (!phaseId) throw new Error("Phase ID is required");

  try {
    const res = await apiClient.get(`/api/phases/${phaseId}`);
    return res.data?.data || res.data;
  } catch (err) {
    console.error(`Error fetching phase ${phaseId}:`, err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || "Failed to fetch phase details";
    throw new Error(errorMessage);
  }
};



/**
 * Fetch all weeks
 * @returns {Promise<Array>} - List of weeks
 */
export const fetchWeeks = async () => {
  try {
    const response = await apiClient.get('/api/weeks');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching weeks:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


/**
 * Create multiple weeks for a given phase
 * @param {Array} weeksData - Array of week objects to be created
 * @param {string} phaseId - The ID of the phase to associate the weeks with
 * @returns {Promise<Array>} - Array of created week objects
 */
export const createWeeks = async (weeksData, phaseId) => {
  try {
    const weekPromises = weeksData.map(week =>
      apiClient.post('/api/weeks', [{ ...week, phase: phaseId }])
    );
    const responses = await Promise.all(weekPromises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error creating weeks:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Weeks API
export const getWeeksByCourse = async (courseId) => {
  const response = await apiClient.get(`/api/weeks/course/${courseId}`);
  return response.data?.data || [];
};

export const fetchAllChapters = async () => {
  try {
    const response = await apiClient.get("/api/chapters");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};



/**
 * Create a new chapter
 * @param {object} chapterData - Chapter data including week, title, and points
 * @returns {Promise<object>} - The created chapter data
 */
export const createChapter = async (chapterData) => {
  try {
    const response = await apiClient.post("/api/chapters", [chapterData]);
    return response.data;
  } catch (error) {
    console.error("Error creating chapter:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
