import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import loadable from "@loadable/component";

const LogIn = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/Signup"));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="login" />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
