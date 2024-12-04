/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 */

import { Text } from "@adobe/react-spectrum";
import { register, attach} from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  } from '@assets/microfrontend';
//import { AssetSelector } from 'https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js';

function AssetMfeExampleForm(props) {
  const navigate = useNavigate("");
  const [conn, setConn] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [imsOrg, setImsOrg] = useState("33C1401053CF76370A490D4C@AdobeOrg");
  const [imsClientId, setImsClientId] = useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  const [repositoryId, setRepositoryId] = useState("delivery-p142461-e1463136.adobeaemcloud.com");
  const [assetSelectorProps, setAssetSelectorProps] = useState({});

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
  }, []);

  useEffect(() => {
    if (conn) {
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = conn?.sharedContext?.get("auth");
      setAuthToken(auth.imsToken); // set the auth token 
      console.info("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(conn?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
    
    
      // imsOrg and imsToken are required for authentication in Adobe application
      setAssetSelectorProps({
        ordId: imsOrg,
        imsToken: auth.imsToken,
        apiKey: imsClientId,
        repositoryId: repositoryId
        //handleSelection: (assets: SelectedAssetType[]) => {},
      });
      
      initAssetSelector(assetSelectorProps);
    }
  }, [conn]);

  /***
   * Initialize the AssetSelector component
   ***/
  function initAssetSelector(assetSelectorProps) {
    // get the container element in which we want to render the AssetSelector component
    const assetSelectContainer = document.getElementById('asset-selector-container');

    //console.log("assetSelectorProps: ", JSON.stringify(assetSelectorProps, null, 2));
    const { renderAssetSelector } = PureJSSelectors;
    PureJSSelectors.renderAssetSelector(assetSelectContainer,assetSelectorProps);
    // Call the `renderAssetSelector` available in PureJSSelectors globals to render AssetSelector
    // PureJSSelectors.renderAssetSelector(container, assetSelectorProps);
    // <AssetSelector {...assetSelectorProps} />
  }

  return <Flex direction="column" gap="size-100" margin="size-200">
    <div id="asset-selector-container"></div>
  </Flex>
}

export default AssetMfeExampleForm;
