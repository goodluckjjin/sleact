import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import loadable from "@loadable/component";

const LogIn = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/Signup"));
const Workspace = loadable(() => import("@layouts/Workspace"));
const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="login" />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/workspace/channel" element={<Channel />} />
      <Route path="/workspace/dm" element={<DirectMessage />} />
    </Routes>
  );
};

export default App;
