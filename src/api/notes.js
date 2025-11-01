// noteApi.js
// import apiClient from "../../../api/axiosConfig";

import apiClient from "./axiosConfig";

/**
 * Fetch a single note by ID
 * @param {string} noteId - The ID of the note to fetch
 * @returns {Promise<Object>} - Returns note data
 */
export const fetchNoteById = async (noteId) => {
  try {
    const response = await apiClient.get(`/api/notes/${noteId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Error fetching note with ID ${noteId}:`, error);
    throw error;
  }
};



/**
 * Create a new note
 */
export const createNote = async (noteData) => {
  try {
    const response = await apiClient.post("/api/notes", noteData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (noteId, noteData) => {
  try {
    const response = await apiClient.put(`/api/notes/${noteId}`, noteData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating note with ID ${noteId}:`, error);
    throw error;
  }
};

/**
 * Fetch all notes
 * @returns {Promise<Array>} - Returns an array of notes
 */
export const fetchAllNotes = async () => {
  try {
    const response = await apiClient.get("/api/notes");
    if (response.data.success) {
      return response.data.data || [];
    } else {
      throw new Error(response.data.message || "Failed to fetch notes");
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

/**
 * Delete a note by ID
 * @param {string} noteId - The ID of the note to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteNote = async (noteId) => {
  try {
    const response = await apiClient.delete(`/api/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note with ID ${noteId}:`, error);
    throw error;
  }
};