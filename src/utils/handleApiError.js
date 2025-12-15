const handleApiError = (err) => {
  // Network or CORS errors: no backend response at all
  if (!err.response) {
    return "Network error. Please check your connection.";
  }

  const { data, status } = err.response;

  // Backend returned a structured message
  if (data?.message) {
    return data.message;
  }

  // Validation errors (Mongoose, express-validator, etc.)
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors[0].msg || "Validation error";
  }

  // Server down or unknown error
  return `Unexpected error (status ${status})`;
};

export default handleApiError;
