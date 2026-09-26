import api from "./api";

export const createCompany = async (companyData) => {
  const response = await api.post("/companies", companyData);
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const getCompany = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const updateCompany = async (companyId, companyData) => {
  const response = await api.put(`/companies/${companyId}`, companyData);
  return response.data;
};

export const deleteCompany = async (companyId) => {
  await api.delete(`/companies/${companyId}`);
};