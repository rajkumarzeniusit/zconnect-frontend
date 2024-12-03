import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store, { history } from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OidcProvider } from "redux-oidc";
import ReactTooltip from "react-tooltip";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <OidcProvider store={store} > */}
      <App history={history} />
      {/* <OidcProvider/> */}
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
