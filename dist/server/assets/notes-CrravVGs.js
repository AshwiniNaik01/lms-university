import { j as apiClient } from "../entry-server.js";
const fetchNoteById = async (noteId) => {
  try {
    const response = await apiClient.get(`/api/notes/${noteId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Error fetching note with ID ${noteId}:`, error);
    throw error;
  }
};
const createNote = async (noteData) => {
  try {
    const response = await apiClient.post("/api/notes", noteData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};
const updateNote = async (noteId, noteData) => {
  try {
    const response = await apiClient.put(`/api/notes/${noteId}`, noteData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating note with ID ${noteId}:`, error);
    throw error;
  }
};
const fetchAllNotes = async () => {
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
const deleteNote = async (noteId) => {
  try {
    const response = await apiClient.delete(`/api/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note with ID ${noteId}:`, error);
    throw error;
  }
};
export {
  fetchAllNotes as a,
  createNote as c,
  deleteNote as d,
  fetchNoteById as f,
  updateNote as u
};
