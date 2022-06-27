import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "@pages/LogIn";
import SignUp from "@pages/SignUp";

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
