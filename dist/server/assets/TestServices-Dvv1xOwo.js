import axios from "axios";
const API_URL = "/api/tests/";
const createTest = async (testData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.post(API_URL, testData, config);
  return response.data;
};
const getTests = async (courseId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(API_URL + "course/" + courseId, config);
  return response.data;
};
const getTestById = async (testId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(API_URL + testId, config);
  return response.data;
};
const submitTest = async (submissionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.post(API_URL + "submit", submissionData, config);
  return response.data;
};
const getMyResults = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(API_URL + "results", config);
  return response.data;
};
const getResultDetails = async (resultId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(API_URL + "results/" + resultId, config);
  return response.data;
};
const testService = {
  createTest,
  getTests,
  getTestById,
  submitTest,
  getMyResults,
  getResultDetails
  // <-- Naya function export kiya gaya
};
export {
  testService as t
};
