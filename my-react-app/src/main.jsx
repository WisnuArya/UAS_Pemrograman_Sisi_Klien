import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import RouteList from "./Router/RouterList";
import { Provider } from "react-redux";
import store from "./Redux/Store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={RouteList} />
    </Provider>
  </StrictMode>
);
