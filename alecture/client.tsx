import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
// import SWRDevtools from "@jjordy/swr-devtools";
// import  { useSWRConfig, Cache } from "swr";
import App from "./layouts/App";

// const { cache, mutate } = useSWRConfig<Cache<any>, ScopedMutator<any>>();
// const { cache, mutate } = useSWRConfig();

render(
  <Router>
    {/* <SWRDevtools cache={cache} mutate={mutate} /> */}
    <App />
  </Router>,
  document.querySelector("#app"),
);
