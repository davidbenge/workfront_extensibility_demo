/*
 * <license header>
 */

import React from "react";
import ErrorBoundary from "react-error-boundary";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ExtensionRegistration from "./ExtensionRegistration";
import CfSelectTableExampleForm from "./CfSelectTableExampleForm.js";
import { defaultTheme, Provider} from '@adobe/react-spectrum';
import AssetMfeExampleForm from "./AssetMfeExampleForm";
import CfSelectExampleForm from "./CfSelectExampleForm";
import AssetMfeExampleForm2 from "./AssetMfeExampleForm2";

function App() {
  const isLocal = window.location.href.indexOf("localhost") > -1 ? true : false; //flag to tell app its running local.
  
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Router>
        <Routes>    
          <Route index element={<ExtensionRegistration isLocal={isLocal}/>} />    
          <Route exact path="index.html" element={<ExtensionRegistration isLocal={isLocal} />}    />    
          <Route exact path="asset_select_example_form" element={<AssetMfeExampleForm isLocal={isLocal}/>} />   
          <Route exact path="asset_select_example_form2" element={<AssetMfeExampleForm2 isLocal={isLocal}/>} /> 
          <Route exact path="cf_select_table_example_form" element={<CfSelectTableExampleForm isLocal={isLocal}/>} /> 
          <Route exact path="cf_select_example_form" element={<CfSelectExampleForm isLocal={isLocal}/>} />   
        </Routes>
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
