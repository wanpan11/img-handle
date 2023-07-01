import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./home";
import "./assets/css/init.css";

const dom = document.getElementById("root") as Element;
const root = createRoot(dom);

root.render(
  <StrictMode>
    <Home></Home>
  </StrictMode>
);
