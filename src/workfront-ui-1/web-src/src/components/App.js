/*
 * <license header>
 */
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ExtensionRegistration from "./ExtensionRegistration.js";
import CfSelectTableExampleForm from "./CfSelectTableExampleForm.js";
import { defaultTheme, Provider} from '@adobe/react-spectrum';
import AssetMfeExampleForm from "./AssetMfeExampleForm.js";
import CfSelectExampleForm from "./CfSelectExampleForm.js";
import AssetMfeExampleForm2 from "./AssetMfeExampleForm2.js";
import DocumentExpressView from "./DocumentExpressView.js";
import ShowValues from "./ShowValues.js";
const expressApiKey = `${process.env.EXPRESS_API_KEY}`
const imsOrg = `${process.env.IMS_ORG}` | undefined
const aemAssetsRepoUrl=`${process.env.AEM_ASSETS_REPO_URL}` | undefined

function App() {
  const isLocal = window.location.href.indexOf("localhost") > -1 ? true : false; //flag to tell app its running local.
  
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Router>
        <Routes>    
          <Route index element={<ExtensionRegistration isLocal={isLocal}/>} />    
          <Route exact path="index.html" element={<ExtensionRegistration isLocal={isLocal}/>}    />    
          <Route exact path="show_task_values" element={<ShowValues isLocal={isLocal} imsOrg={imsOrg} aemAssetsRepoUrl={aemAssetsRepoUrl}/>} />
          <Route exact path="asset_select_example_form" element={<AssetMfeExampleForm isLocal={isLocal} aemAssetsRepoUrl={aemAssetsRepoUrl}/>} />   
          <Route exact path="asset_select_example_form2" element={<AssetMfeExampleForm2 isLocal={isLocal} aemAssetsRepoUrl={aemAssetsRepoUrl}/>} /> 
          <Route exact path="cf_select_table_example_form" element={<CfSelectTableExampleForm isLocal={isLocal} imsOrg={imsOrg} aemAssetsRepoUrl={aemAssetsRepoUrl}/>} /> 
          <Route exact path="cf_select_example_form" element={<CfSelectExampleForm isLocal={isLocal} imsOrg={imsOrg}/>} />  
          <Route exact path="open_in_express" element={<DocumentExpressView isLocal={isLocal} expressApiKey={expressApiKey} imsOrg={imsOrg}/>} />
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
