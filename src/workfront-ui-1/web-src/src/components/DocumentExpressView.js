/*
 * <license header>
 *
 * add in DocumentExpressView
 * add in example form for aem asset selector 
 */
import { Text } from "@adobe/react-spectrum";
import { register, attach} from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//await import("https://cc-embed.adobe.com/sdk/v4/CCEverywhere.js");

function DocumentExpressView(props) {
  const navigate = useNavigate("");
  const [conn, setConn] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [imsOrg, setImsOrg] = useState("33C1401053CF76370A490D4C@AdobeOrg");
  const [imsClientId, setImsClientId] = useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  const [repositoryId, setRepositoryId] = useState("delivery-p142461-e1463136.adobeaemcloud.com");
  const [assetSelectorProps, setAssetSelectorProps] = useState({});
  let expressEditor; //express editor instance

  const handleGoBack = () => {
    navigate('/');
  };

  useEffect(() => {
    
    const iife = async () => {
        // "attach" the guest application to the host. This creates a "tunnel" from the host app that allows data to be passed to the iframe running this app.
        const connection = await attach({
            id: extensionId,
        });
        setConn(connection);
    };
    iife();

    initExpress();

  }, []);

  useEffect(() => {
    if (conn) {
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = conn?.sharedContext?.get("auth");
      setAuthToken(auth.imsToken); // set the auth token 
      console.info("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(conn?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
    }
  }, [conn]);

  async function initExpress(){
    //this sucks, i am not proud of this.
    let script = document.createElement('script');
    script.src = 'https://cc-embed.adobe.com/sdk/v4/CCEverywhere.js';
    document.body.appendChild(script);

    script.onload = function() {
        // The script has loaded successfully; you can now use its functions or variables
        console.log('Express script loaded!');

        // move to post conn to get auth token. fingers crossed that works.
        configParams = {};
        initializeParams = {
          clientId: props.expressApiKey, //api key from developer console
          appName: "wf_express_poc",
        };

        // Optional document settings (canvas size)
        let docConfig = {};
        // Optional application settings (allowed files, template, etc.)
        let appConfig = {};
        // Optional export settings (label, action type, style, etc.)
        let exportConfig = [];

        (async() => {
          console.log("window.CCEverywhere",window.CCEverywhere);
          const { editor } = await window.CCEverywhere.initialize(initializeParams, configParams);
          editor.create(docConfig, appConfig, exportConfig);
        })();
    };
  };

  return <Flex direction="column" gap="size-100" margin="size-200">
    <div id="expressEditor"></div>
    doc express
  </Flex>
}

export default DocumentExpressView;
