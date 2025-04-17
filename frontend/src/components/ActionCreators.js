import localStorage from "local-storage";
import { baseUrl } from "../url";

// Helper to construct auth headers
export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.get('token')}`
});

// ✅ Logout
export const postLogout = () => {
  localStorage.clear();
  window.location.reload();
};

// ✅ Teacher APIs
export const fetchSubjects = () =>
  fetch(`${baseUrl}/teacher/subject`, {
    headers: getAuthHeaders()
  });

export const postQuestion = (question) =>
  fetch(`${baseUrl}/teacher/question/post`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(question),
  });

export const getSubjectDetails = (id) =>
  fetch(`${baseUrl}/teacher/question/get/${id}`, {
    headers: getAuthHeaders(),
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

// Add these functions alongside other question-related functions

export const getMcqs = (details) =>
  fetch(`${baseUrl}/teacher/mcq/get`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(details),
  });

export const editMcqs = (details, id, unit) => {
  const payload = {
    id,
    unit,
    mcq: details
  };
  return fetch(`${baseUrl}/teacher/mcq/put`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};