import api from "./api";

export const createCandidateProfile = async (profileData) => {
  const response = await api.post("/candidates", profileData);
  return response.data;
};

export const getCandidateProfiles = async () => {
  const response = await api.get("/candidates");
  return response.data;
};

export const getCandidateProfile = async (profileId) => {
  const response = await api.get(`/candidates/${profileId}`);
  return response.data;
};

export const updateCandidateProfile = async (profileId, profileData) => {
  const response = await api.put(`/candidates/${profileId}`, profileData);
  return response.data;
};

export const deleteCandidateProfile = async (profileId) => {
  await api.delete(`/candidates/${profileId}`);
};