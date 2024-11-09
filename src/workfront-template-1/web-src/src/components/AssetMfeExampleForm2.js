/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AssetMfeExampleForm2() {
  const navigate = useNavigate();
  const [conn, setConn] = useState();
  let [authToken, setAuthToken] = React.useState("");
  let [imsOrg, setImsOrg] = React.useState("33C1401053CF76370A490D4C@AdobeOrg");
  let [imsClientId, setImsClientId] = React.useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  let [repositoryId, setRepositoryId] = React.useState("delivery-p142461-e1463137.adobeaemcloud.com");
  // container element on which you want to render the AssetSelector/DestinationSelector component
  let container; // = document.getElementById('asset-selector');
  let assetSelectorDialog; // = document.getElementById('asset-selector-dialog');
  let registeredTokenService; // to store the registered token service
  let imsInstance; // to store the ims instance

  const assetSelectorProps = {
    "imsOrg": imsOrg,
  };

  const imsProps = {
    "imsOrg":imsOrg,
    "imsScope": "openid, <other scopes>",
    "redirectUrl": window.location.href,
    "modalMode": true, // false to open in a full page reload flow
    "authToken":authToken,
    "imsClientId":imsClientId,
    "repositoryId":repositoryId,
    "aemTierType": ['author', 'delivery'],
    onImsServiceInitialized: (service) => {
      // invoked when the ims service is initialized and is ready
      console.log("onImsServiceInitialized", service);
    },
    onAccessTokenReceived: (token) => {
        console.log("onAccessTokenReceived", token);
    },
    onAccessTokenExpired: () => {
        console.log("onAccessTokenError");
        // re-trigger sign-in flow
    },
    onErrorReceived: (type, msg) => {
        console.log("onErrorReceived", type, msg);
    },
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
    } 

    console.log("imsProps: ", JSON.stringify(imsProps, null, 2));
    console.log("assetSelectorProps: ", JSON.stringify(assetSelectorProps, null, 2));
    load(imsProps,assetSelectorProps); //load asset selector
  }, [conn]);

  function handleBackClick(event) {
    navigate('/', { replace: true });
  }

  function load(pImsProps,pAssetSelectorProps) {
    assetSelectorDialog = document.getElementById('asset-selector-dialog');
    registeredTokenService = PureJSSelectors.registerAssetsSelectorsAuthService(pImsProps);
    imsInstance = registeredTokenService;

    container = document.getElementById('asset-selector');

    /// Use the PureJSSelectors in globals to render the AssetSelector/DestinationSelector component
    PureJSSelectors.renderAssetSelectorWithAuthFlow(container, pAssetSelectorProps, () => {
        assetSelectorDialog.showModal();
    });
  };

  return (
    <Flex direction="column" gap="size-100" margin="size-200">
      <Flex direction="row" gap={8}>
        <Button variant="accent" onPress={handleBackClick} >Back</Button>
      </Flex>
      <dialog id="asset-selector-dialog">
        <div id="asset-selector"></div>
      </dialog>
    </Flex>
  );
}

export default AssetMfeExampleForm2;
