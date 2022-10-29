import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./components/css/components/index.scss";
import App from "./App";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { cache } from "./apollo/cache";

export const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: cache,
  connectToDevTools: true,
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //     errorPolicy: "all",
  //   },
  // },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
