/*
 * <license header>
 */

import React from "react";
import ErrorBoundary from "react-error-boundary";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExtensionRegistration from "./ExtensionRegistration";
import CfExampleForm from "./CfExampleForm";
import { defaultTheme, Provider} from '@adobe/react-spectrum';
import AssetMfeExampleForm from "./AssetMfeExampleForm";

function App() {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Router>
        <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
          <Routes>
          <Route exact path="assetexampleform" element={<AssetMfeExampleForm />} />
            <Route exact path="cfexampleform" element={<CfExampleForm />} />
            <Route path="*" element={<ExtensionRegistration />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </Provider>
  )

  // error handler on UI rendering failure
  function onError(e, componentStack) {}

  // component to show if UI fails rendering
  function fallbackComponent({ componentStack, error }) {
    return (
        <React.Fragment>
          <h1 style={{ textAlign: "center", marginTop: "20px" }}>
            Phly, phly... Something went wrong :(
          </h1>
          <pre>{componentStack + "\n" + error.message}</pre>
        </React.Fragment>
    );
  }
}

export default App;
