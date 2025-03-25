import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

// REMOVE OR COMMENT OUT THIS LINE:
// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// REMOVE OR COMMENT OUT THIS LINE:
// reportWebVitals();
