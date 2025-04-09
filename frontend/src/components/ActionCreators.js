import localStorage from "local-storage";
import { baseUrl } from "../url";

// Helper to construct auth headers
const getAuthHeaders = (contentType = true) => {
  const headers = {
    Authorization: "Bearer " + localStorage.get("token"),
  };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
};

// ✅ Logout
export const postLogout = () => {
  localStorage.clear();
  window.location.reload();
};

// ✅ Teacher APIs
export const fetchSubjects = () =>
  fetch(`${baseUrl}/teacher/subject/`, {
    headers: getAuthHeaders(false),
  });

export const postQuestion = (question) =>
  fetch(`${baseUrl}/teacher/question/post`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(question),
  });

export const getSubjectDetails = () =>
  fetch(`${baseUrl}/teacher/question/get`, {
    headers: getAuthHeaders(false),
  });

export const getQuestions = (details, difficulty) =>
  fetch(`${baseUrl}/teacher/${difficulty}/get`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

export const editQuestions = (details, id, difficulty, unit) => {
  const payload = {
    id,
    unit,
    [difficulty]: details,
  };
  return fetch(`${baseUrl}/teacher/${difficulty}/put`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

// ✅ Admin: Departments
export const addDepartment = (details) =>
  fetch(`${baseUrl}/admin/department/GetandAddandRemove`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

export const removeDepartment = (details) =>
  fetch(`${baseUrl}/admin/department/GetandAddandRemove`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

export const getDepartment = () =>
  fetch(`${baseUrl}/admin/department/GetandAddandRemove`, {
    headers: getAuthHeaders(false),
  });

// ✅ Admin: Subjects
export const addSubject = (details) =>
  fetch(`${baseUrl}/admin/subject/GetandAddandRemove`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

export const removeSubject = (code) =>
  fetch(`${baseUrl}/admin/subject/GetandAddandRemove`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify(code),
  });

export const getSubjects = (details) =>
  fetch(`${baseUrl}/admin/subject/get`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

// ✅ Profile
export const getProfile = () =>
  fetch(`${baseUrl}/teacher/update`, {
    headers: getAuthHeaders(false),
  });

export const updateProfile = (details) =>
  fetch(`${baseUrl}/teacher/update`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });
