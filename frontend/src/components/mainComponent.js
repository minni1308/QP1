import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./signup/signupComponent";
import Confirmation from "./signup/confirmationComponent";
import Login from "./login/loginComponent";
import Home from "./home/homeComponent";
import Landing from "./home/landingComponent";
import Forgot from "./forgot/verifyComponent";
import Update from "./forgot/updateComponent";
import SignNav from "./navbar/signNav";
import Profile from "./profileComponent";
import LoginNav from "./navbar/loginNav";
import AdminLoginNav from "./navbar/adminNav";
import Alpha from "./insert/alphaComponent";
import Generate from "./generate/schemaComponent";
import Options from "./edit/optionComponent";
import Department from "./Admin/department";
import Subject from "./Admin/subject";
import AdminHome from "./Admin/adminHome";

import localStorage from "local-storage";

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
        <Route path="/user/:userId" element={<Confirmation />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot/:userId" element={<Update />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* Admin Routes */}
        <Route path="/department" element={
          <PrivateRoute adminOnly><Department /></PrivateRoute>
        } />
        <Route path="/subject" element={
          <PrivateRoute adminOnly><Subject /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute adminOnly><Profile /></PrivateRoute>
        } />
        <Route path="/adminhome" element={
          <PrivateRoute adminOnly><AdminHome /></PrivateRoute>
        } />

        {/* Teacher Routes */}
        <Route path="/insert" element={
          <PrivateRoute><Alpha /></PrivateRoute>
        } />
        <Route path="/generate" element={
          <PrivateRoute><Generate /></PrivateRoute>
        } />
        <Route path="/edit" element={
          <PrivateRoute><Options /></PrivateRoute>
        } />
        <Route path="/landing" element={
          <PrivateRoute><Landing /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to={token ? "/landing" : "/home"} />} />
      </Routes>
    </>
  );
};

export default Main;
