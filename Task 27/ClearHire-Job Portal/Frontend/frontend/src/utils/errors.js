export function getApiError(
  error,
  fallback = "Something went wrong."
) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return (
      detail
        .map((item) => item?.msg)
        .filter(Boolean)
        .join(", ") || fallback
    );
  }

  if (
    typeof detail === "string" &&
    detail.trim()
  ) {
    return detail;
  }

  if (error?.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error?.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error?.response?.status === 404) {
    return "The requested resource was not found.";
  }

  if (error?.response?.status >= 500) {
    return "The server encountered an error. Please try again.";
  }

  if (!error?.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return fallback;
}