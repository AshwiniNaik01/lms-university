// 📦 Axios instance
import apiClient from "../../api/axiosConfig";

// 📍 API base endpoint
const ENDPOINT = "/api/session-category";


//  Fetch all session categories
export const getSessionCategories = async () => {
  const response = await apiClient.get(ENDPOINT);
  return response.data?.data || [];
};


//  Create a new session category
export const createSessionCategory = async (data) => {
  const response = await apiClient.post(ENDPOINT, data);
  return response.data;
};


//  Update an existing session category
export const updateSessionCategory = async (id, data) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};


//  Delete a session category
export const deleteSessionCategory = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};



// ============================================================================================================================
                                        // EventApi

                                        
export const getEventById = (id) =>
  apiClient.get(`/api/event/${id}`);

export const createEvent = (formData) =>
  apiClient.post("/api/event", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateEvent = (id, formData) =>
  apiClient.put(`/api/event/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  
// ============================================================================================================================
                                        // WebinarApi

// Fetch a webinar by ID
export const getWebinarById = (webinarId) => {
  return apiClient.get(`/api/webinars/${webinarId}`);
};

// Update existing webinar
export const updateWebinar = (webinarId, formData) => {
  return apiClient.put(`/api/webinars/${webinarId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Create a new webinar
export const createWebinar = (formData) => {
  return apiClient.post("/api/webinars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// ============================================================================================================================
                                        // WorkshopApi

const WORKSHOP_BASE_URL = '/api/workshops';

export const fetchWorkshopById = async (id) => {
  const response = await apiClient.get(`${WORKSHOP_BASE_URL}/${id}`);
  return response.data?.data || null;
};

export const createWorkshop = async (payload) => {
  const response = await apiClient.post(WORKSHOP_BASE_URL, payload);
  return response.data;
};

export const updateWorkshop = async (id, payload) => {
  const response = await apiClient.put(`${WORKSHOP_BASE_URL}/${id}`, payload);
  return response.data;
};

