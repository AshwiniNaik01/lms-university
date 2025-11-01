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


export const fetchAllChapters = async () => {
  try {
    const response = await apiClient.get("/api/chapters");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

