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

function CfExampleForm(props) {
  const navigate = useNavigate();
  let [authToken, setAuthToken] = useState("");
  // CF claim options
  let [claims, setClaims] = useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = useState(null);
  let [claimName, setClaimName] = useState("");
  const [conn, setConn] = useState();
  let [imsOrg, setImsOrg] = useState("33C1401053CF76370A490D4C@AdobeOrg");
  let [imsClientId, setImsClientId] = useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  let [repositoryId, setRepositoryId] = useState("delivery-p142461-e1463137.adobeaemcloud.com");
  const [isOpen, setIsOpen] = useState(false);

  const handleGoBack = () => {
    navigate('/');
  };

  useEffect(() => {
    script = document.createElement('script');
    script.src = "https://experience.adobe.com/solutions/CQ-sites-content-fragment-selector/static-assets/resources/content-fragment-selector.js";
    document.head.appendChild(script)

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
  }, [conn]);

  return (
    <>
    <script src="https://experience.adobe.com/solutions/CQ-sites-content-fragment-selector/static-assets/resources/content-fragment-selector.js"></script>

<script>
  const { renderContentFragmentSelector } = PureJSSelectors;
</script></>
  );
}

export default CfExampleForm;