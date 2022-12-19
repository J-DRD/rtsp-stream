// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
declare const module: any;

if (module.hot) {
  module.hot.accept();
}

/* --------------------------------------------------------------------------------------------- */
const client = document.createElement("div");
document.body.appendChild(client);

const root = createRoot(client);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
