import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import * as Mantine from "../node_modules/@mantine/core/cjs/index.cjs";
import "@mantine/core/styles.css";

const { MantineProvider } = Mantine;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
