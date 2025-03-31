/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 */

import { ActionButton, DialogTrigger, Text, Button, CopyIcon, Table, TableHeader, TableBody, Row, Cell } from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentFragmentSelector } from "@aem-sites/content-fragment-selector";
import authTokenManager from './utils/authTokenManager';

function CfExampleForm(props) {
  const navigate = useNavigate();
  let [authToken, setAuthTokenState] = useState("");
  // Custom setter that uses authTokenManager
  const setAuthToken = (token) => {
    setAuthTokenState(token);
    authTokenManager.initialize(token);
    console.info("authTokenManager initialized for client_id", authTokenManager.getDecodedTokenData().client_id);
    console.info("authTokenManager initialized with scope", authTokenManager.getDecodedTokenData().scope);
  };
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
  const [contentFragments, setContentFragments] = useState([]);
  const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.net"; //STAGE
  //const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.net"; //PROD

  const handleGoBack = () => {
    navigate('/');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
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
      const token = auth.imsToken;
      setAuthToken(token); // set the auth token 
      console.info("authToken passed down from WF", token); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(conn?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
    }
  }, [conn]);

  return (
    <Flex direction="column" gap="size-200">
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
            const contentFragmentPath = `https://${usedDomainName}${selectedContentFragment.path}.cfm.gql.json`;
            setContentFragments(prev => [...prev, contentFragmentPath]);
            setIsOpen(false);
          }}
        />
      </DialogTrigger>

      {contentFragments.length > 0 && (
        <Table aria-label="Content Fragment Paths">
          <TableHeader>
            <Column>Path</Column>
            <Column>Actions</Column>
          </TableHeader>
          <TableBody>
            {contentFragments.map((path, index) => (
              <Row key={index}>
                <Cell>{path}</Cell>
                <Cell>
                  <Button
                    variant="ghost"
                    onPress={() => copyToClipboard(path)}
                    aria-label="Copy to clipboard"
                  >
                    <CopyIcon />
                  </Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      )}
    </Flex>
  );
}

export default CfExampleForm;