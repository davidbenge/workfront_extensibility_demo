/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 */

import { ActionButton, DialogTrigger, Text } from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentFragmentSelector } from "@aem-sites/content-fragment-selector";

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
  let [repoId, setRepositoryId] = useState("author-p111858-e1309055.adobeaemcloud.net");
  const [isOpen, setIsOpen] = useState(true);
  const [localNavVisible, setLocalNavVisible] = useState(true);
  const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.net"; //STAGE
//const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.net"; //PROD

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
      setLocalNavVisible(false); // hide the local nav
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = conn?.sharedContext?.get("auth");
      setAuthToken(auth.imsToken); // set the auth token 
      console.info("authToken passed down from WF", auth.imsToken); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(conn?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
    }
  }, [conn]);

  return (
    <DialogTrigger type="fullscreen" isOpen={isOpen}>
        <ActionButton onPress={() => setIsOpen(true)}>Show Fragment Selector</ActionButton>
        <ContentFragmentSelector
            orgId={imsOrg}
            imsToken={authToken}
            repoId={repoId}
            isOpen={isOpen}
            filters={{
                folder: "/content/dam",
                status: ["PUBLISHED", "MODIFIED"],
                tag: [
                        {
                            id: "1:",
                            name: "1",
                            path: "/content/cq:tags/1",
                            description: "",
                        },
                    ],
            }}
            readonlyFilters={{
                tag: [
                        {
                            id: "1:",
                            name: "1",
                            path: "/content/cq:tags/1",
                            description: "",
                        },
                    ],
            }}
            onDismiss={() => setIsOpen(false)}
            onSubmit={({ contentFragments, domainNames }) => {
                const selectedContentFragment = contentFragments[0];
                const usedDomainName = domainNames[0];
                const contentFragmentAlert = `Example link: https://${usedDomainName}${selectedContentFragment.path}.cfm.gql.json`;
                alert(contentFragmentAlert);
            }}
        />
    </DialogTrigger>
  );
}

export default CfExampleForm;