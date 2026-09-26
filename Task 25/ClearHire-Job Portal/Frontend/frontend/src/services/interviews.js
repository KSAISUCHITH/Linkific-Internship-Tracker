import api from "./api";

export const createInterview = async (interviewData) => {
  const response = await api.post("/interviews", interviewData);
  return response.data;
};

export const getInterview = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}`);
  return response.data;
};

export const getApplicationInterviews = async (applicationId) => {
  const response = await api.get(
    `/interviews/application/${applicationId}`
  );
  return response.data;
};

export const updateInterview = async (interviewId, interviewData) => {
  const response = await api.put(
    `/interviews/${interviewId}`,
    interviewData
  );
  return response.data;
};

export const deleteInterview = async (interviewId) => {
  await api.delete(`/interviews/${interviewId}`);
};