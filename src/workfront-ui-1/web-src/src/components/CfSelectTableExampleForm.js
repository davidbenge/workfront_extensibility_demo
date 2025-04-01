/*
 * <license header>
 *
 * select a value and see data from CF persistant gql query
 *
 * 
 */

import { Text } from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField, ListBox, Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { useState, useEffect, useRef, useMemo } from 'react';
/*import AEMHeadless from "@adobe/aem-headless-client-js";*/
import { useParams, navigate } from "react-router-dom";
import Search from "@spectrum-icons/workflow/Search";
import axios from "axios";
import JoditEditor from 'jodit-react';
//const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.com"; //STAGE
const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.com"; //PROD
import authTokenManager from '../utils/authTokenManager';

function CfSelectExampleForm(props) {
  let [authToken, setAuthTokenState] = useState("");
  // Custom setter that uses authTokenManager
  const setAuthToken = (token) => {
    setAuthTokenState(token);
    authTokenManager.initialize(token);
    console.info("authTokenManager initialized for client_id", authTokenManager.getDecodedTokenData().client_id);
    console.info("authTokenManager initialized with scope", authTokenManager.getDecodedTokenData().scope);
  };
  const [conn, setConn] = useState();
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  const [relatedClaimSearchText, setRelatedClaimSearchText] = useState("");
  const [localNavVisible, setLocalNavVisible] = useState(true);

  let [brands, setBrands] = React.useState([]); // Brand options
  const demoDataBrands = [
    {id: "regulatory-brand:trumantic", name: 'Trumantic'},
    {id: "regulatory-brand:sereniday", name: 'SereniDay'}
  ];

  const handleBrandChange = (e) => {
    console.info("brand change",e);
    console.info("authToken",authToken);

    const runQuery = async () => {
      try {
        const queryParam = encodeURIComponent(`;brand=${e}`);
        //const queryParam = `;brand=${e}`;
        const callUrl = `${AEM_HOST}/graphql/execute.json/regulatory-review/getListClaimsByBrand${queryParam}`;
        console.log("queryParam",queryParam);
        const response = await fetch(callUrl,{
          headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${authToken}`
          }
        });
        if(response){
          const data = await response.json();
          console.log(JSON.stringify(data, null, 2));
          //update the data grid
          setClaims(data.data.claimList.items);
        }
        console.info("call main and no results");
      } catch (callError) {
        console.error(callError);
      }
    }
    runQuery();
  };

  useEffect(() => {
    // Init brands
    setBrands(demoDataBrands);

    const iife = async () => {
        // "attach" the guest application to the host. This creates a "tunnel" from the host app that allows data to be passed to the iframe running this app.
        const connection = await attach({
            id: extensionId,
        })
        .then((connection) => {
            setConn(connection);
        })
        .catch((error) => {
            console.error("Error registering with guest server:", error);
        });
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
    
      const objCode = conn?.sharedContext?.get("objCode");
      console.log("###### objCode ######", objCode);
    }
  }, [conn]);

  let onSubmit = (e) => {
    e.preventDefault();

    // TODO: write to fusion webhook to handle form submit  

    alert(selectedSecondaryClaimId);
  };

  return (
    <>
    <Flex direction="column" gap="size-100" margin="size-200">
      <View borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
        <Form onSubmit={onSubmit} >
          <Picker isRequired label="Brand" onSelectionChange={handleBrandChange} items={brands}>
            {(item) => <Item key={item.id}>{item.name}</Item>}
          </Picker>
          <TableView
            aria-label="Example table with multiple selection"
            selectionMode="single"
          >
            <TableHeader>
              <Column>Claim text</Column>
              <Column>Claim description</Column>
              <Column align="end">indication</Column>
            </TableHeader>
            <TableBody items={claims}>
              {item => (
                <Row key={item._id}>
                  <Cell>{item.title}</Cell>
                  <Cell>{item.description.plaintext}</Cell>
                  <Cell>{item.indication}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
        </Form>
      </View>
    </Flex>
    </>
  );
}

export default CfSelectExampleForm;
