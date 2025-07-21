// src/sidebar/index.tsx (create this file)
import React from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "../sidebar";

const root = document.getElementById("root");
if (root) createRoot(root).render(<Sidebar />);
