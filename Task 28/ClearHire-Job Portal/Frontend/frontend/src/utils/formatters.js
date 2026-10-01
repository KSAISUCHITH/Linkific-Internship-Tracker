export function formatSalary(
  salaryMin,
  salaryMax
) {
  if (
    salaryMin == null &&
    salaryMax == null
  ) {
    return "Salary not specified";
  }

  if (
    salaryMin != null &&
    salaryMax != null
  ) {
    return `₹${Number(
      salaryMin
    ).toLocaleString(
      "en-IN"
    )} - ₹${Number(
      salaryMax
    ).toLocaleString(
      "en-IN"
    )}`;
  }

  if (salaryMin != null) {
    return `From ₹${Number(
      salaryMin
    ).toLocaleString("en-IN")}`;
  }

  return `Up to ₹${Number(
    salaryMax
  ).toLocaleString("en-IN")}`;
}


export function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


export function formatDateTime(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


export function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}