import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./signup/signupComponent";
import Confirmation from "./signup/confirmationComponent";
import Login from "./login/loginComponent";
import Home from "./home/homeComponent";
import Landing from "./home/landingComponent";
import TeacherLanding from "./teacher/teacherLandingComponent";
import Forgot from "./forgot/verifyComponent";
import Update from "./forgot/updateComponent";
import SignNav from "./navbar/signNav";
import Profile from "./profileComponent";
import LoginNav from "./navbar/loginNav";
import AdminLoginNav from "./navbar/adminNav";
import Alpha from "./insert/alphaComponent";
import Generate from "./generate/schemaComponent";
import GenerateQuestions from "./teacher/generateQuestionsComponent";
import Options from "./edit/optionComponent";
import Department from "./Admin/department";
import Subject from "./Admin/subject";
import AdminHome from "./Admin/adminHome";
import TeacherSubjectsManager from "./Admin/TeacherSubjectsManager";

import localStorage from "local-storage";
import DisplayGeneratedQuestionsComponent from "./teacher/DisplayGeneratedQuestionsComponent";
const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.get("token");
  const user = localStorage.get("user");

  if (!token) return <Navigate to="/home" />;
  if (adminOnly && (!user || !user.admin)) return <Navigate to="/home" />;

  return children;
};

const Main = () => {
  const user = localStorage.get("user");
  const token = localStorage.get("token");

  const nav = token
    ? user?.admin
      ? <AdminLoginNav user={user} />
      : <LoginNav user={user} />
    : <SignNav />;

  return (
    <>
      {nav}
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:userId" element={<Confirmation />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot/:userId" element={<Update />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Admin Routes */}
        <Route path="/admin/department" element={
          <PrivateRoute adminOnly><Department /></PrivateRoute>
        } />
        <Route path="/admin/subject" element={
          <PrivateRoute adminOnly><Subject /></PrivateRoute>
        } />
        <Route path="/admin/profile" element={
          <PrivateRoute adminOnly><Profile /></PrivateRoute>
        } />
        <Route path="/admin/home" element={
          <PrivateRoute adminOnly><AdminHome /></PrivateRoute>
        } />
        <Route path="/admin/teacher-subjects" element={
          <PrivateRoute adminOnly><TeacherSubjectsManager /></PrivateRoute>
        } />

        {/* Teacher Routes */}
        <Route path="/teacher/insert" element={
          <PrivateRoute><Alpha /></PrivateRoute>
        } />
        <Route path="/teacher/generate" element={
          <PrivateRoute><Generate /></PrivateRoute>
        } />
        <Route path="/teacher/generate-questions" element={
          <PrivateRoute><GenerateQuestions /></PrivateRoute>
          
        } />

        <Route path="/teacher/display-generated-questions" element={
          <PrivateRoute><DisplayGeneratedQuestionsComponent /></PrivateRoute>
        } />
        
        <Route path="/teacher/edit" element={
          <PrivateRoute><Options /></PrivateRoute>
        } />
        <Route path="/teacher/landing" element={
          <PrivateRoute><TeacherLanding /></PrivateRoute>
        } />
        <Route path="/teacher/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        {/* Default fallback - only redirect if not a verification path */}
        <Route path="*" element={({ location }) => {
          if (location.pathname.startsWith('/verify/')) {
            return null; // Don't redirect verification paths
          }
          return <Navigate to={token ? (user?.admin ? "/admin/home" : "/teacher/landing") : "/home"} />;
        }} />
      </Routes>
    </>
  );
};

export default Main;
