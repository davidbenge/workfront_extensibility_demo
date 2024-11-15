/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 *
 * 
 * const response = await fetch('https://author-p142461-e1463137.adobeaemcloud.com/graphql/execute.json/global/allClaims',{
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${authToken}`
        }
       });
      const data = await response.json();
 */

import { Text } from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField, ListBox, Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AEMHeadless from "@adobe/aem-headless-client-js";
import { useParams, navigate } from "react-router-dom";
import Search from "@spectrum-icons/workflow/Search";
import axios from "axios";
const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.net"; //STAGE
//const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.net"; //PROD

function CfSelectExampleForm(props) {
  const navigate = useNavigate();
  let aemHeadlessClient; // AEM Headless client
  const [authToken, setAuthToken] = React.useState("");
  const [conn, setConn] = useState();
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  const [relatedClaimSearchText, setRelatedClaimSearchText] = useState("");
  const [localNavVisible, setLocalNavVisible] = useState(true);

  let [brands, setBrands] = React.useState([]); // Brand options
  const demoDataBrands = [
    {id: "regulatory:trumantic", name: 'Trumantic'},
    {id: "regulatory:sereniday", name: 'SereniDay'}
  ];

  const handleGoBack = () => {
    navigate('/');
  };

  const handleBrandChange = (e) => {
    console.info("brand change",e);
    console.info("authToken",authToken);

    if(!aemHeadlessClient){
      aemHeadlessClient = new AEMHeadless({
        serviceURL: AEM_HOST,
        endpoint: "/graphql",
        auth: `${authToken}` });
    }

    const runQuery = async () => {
      let getData
      try {
        getData = await aemHeadlessClient.runPersistedQuery("regulatory-review/getListClaimsByBrand", {brandId: e});
      } catch (e) {
        console.error(e);
      }

      console.log(JSON.stringify(getData, null, 2));
      setClaims(getData.data.claimList.items);
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

  let onSubmit = (e) => {
    e.preventDefault();

    // TODO: write to fusion webhook to handle form submit  

    alert(selectedSecondaryClaimId);
  };

  return (
    <>
    <Flex direction="column" gap="size-100" margin="size-200">
      {props.isLocal ? (
      <Flex direction="row" gap={8} isHidden={localNavVisible}>
        <Button variant="accent" onPress={handleGoBack} >Back</Button>
      </Flex>
      ) : ('')}
      <View borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
          {
            // <Text>Primary Claim {claimName}</Text>
          }
        <Form onSubmit={onSubmit} >
          {
          //<TextField label="Claim Name" value={claimName} onChange={setClaimName} />
          }
          <Picker isRequired label="Brand" onSelectionChange={handleBrandChange} items={brands}>
            {(item) => <Item key={item.id}>{item.name}</Item>}
          </Picker>
          {
            /*
          <Flex direction="row" gap={8} alignItems="end">
            <TextField label="Related Claim Search" onChange={setRelatedClaimSearchText}/>
            <Button variant="primary" onPress={handleClaimNarrow}>
              <Search />
              <Text>Search</Text>
            </Button>
          </Flex>
          */
          }
          <TableView
            aria-label="Example table with multiple selection"
            selectionMode="single"
          >
            <TableHeader>
              <Column>Claim Text</Column>
              <Column align="end">First use date</Column>
            </TableHeader>
            <TableBody items={claims}>
              {item => (
                <Row key={item.id}>
                  <Cell>{item.claimText}</Cell>
                  <Cell>{item.firstUseDate}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
          { 
          /*
            <ButtonGroup>
              <Button type="submit" variant="primary">Save</Button>
              <Button type="reset" variant="secondary">Reset</Button>
            </ButtonGroup>
          */
          }
        </Form>
      </View>
    </Flex>
    </>
  );
}

export default CfSelectExampleForm;
