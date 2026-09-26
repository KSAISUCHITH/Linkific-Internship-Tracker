import api from "./api";

export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my-applications");
  return response.data;
};

export const getApplication = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplication = async (applicationId, applicationData) => {
  const response = await api.put(
    `/applications/${applicationId}`,
    applicationData
  );
  return response.data;
};

export const deleteApplication = async (applicationId) => {
  await api.delete(`/applications/${applicationId}`);
};