// import "./index.css";

import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";

hydrateRoot(
  document.getElementById("root"),
  <>
    <BrowserRouter>
      <Provider store={store}>
        {" "}
        {/* ✅ Redux context */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </>
);
