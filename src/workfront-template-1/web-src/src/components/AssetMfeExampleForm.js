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

function AssetMfeExampleForm() {
  const navigate = useNavigate();
  let [authToken, setAuthToken] = React.useState("");
  let [imsOrg, setImsOrg] = React.useState("33C1401053CF76370A490D4C@AdobeOrg");
  let [imsClientId, setImsClientId] = React.useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  let [repositoryId, setRepositoryId] = React.useState("delivery-p142461-e1463137.adobeaemcloud.com");

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

  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      metadata
    });
  };
  init().catch(console.error);

  function handleBackClick(event) {
    navigate('/', { replace: true });
  }

  function load() {
    const registeredTokenService = PureJSSelectors.registerAssetsSelectorsAuthService(imsProps);
    imsInstance = registeredTokenService;
  };

  useEffect(() => {
    load();
  }, []);

  function initAssetSelector(options) {
    // get the container element in which we want to render the AssetSelector component
    const container = document.getElementById('asset-selector-container');
    // imsOrg and imsToken are required for authentication in Adobe application
    const assetSelectorProps = {
      imsOrg: options.imsOrg,
      imsToken: options.authToken,
      apiKey: options.apiKey,
      //repositoryId: options.repositoryId,
      env: "PROD"
        //handleSelection: (assets: SelectedAssetType[]) => {},
    };

    console.log("assetSelectorProps: ", JSON.stringify(assetSelectorProps, null, 2));
    
    // Call the `renderAssetSelector` available in PureJSSelectors globals to render AssetSelector
    PureJSSelectors.renderAssetSelector(container, assetSelectorProps);
  }

  return (
    <Flex direction="column" gap="size-100" margin="size-200">
      <Flex direction="row" gap={8}>
        <Button variant="accent" onPress={handleBackClick} >Back</Button>
      </Flex>
      <div id="asset-selector-container"></div>
    </Flex>
  );
}

export default AssetMfeExampleForm;
