import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "leaflet/dist/leaflet.css";  // <-- Put the Leaflet CSS import here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
