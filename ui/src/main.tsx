import "./global.css";
// src/main.tsx

import { createRoot } from "react-dom/client";
import { Routes } from "@generouted/react-router/lazy";

const app = document.getElementById("root");
if (app === null) throw new Error("No #app element found");
createRoot(app).render(<Routes />);
