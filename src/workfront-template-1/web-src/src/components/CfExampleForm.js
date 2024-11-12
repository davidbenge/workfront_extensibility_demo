/*
 * <license header>
 *
 * add in CF fragment selector 
 * add in example form for aem asset selector 
 */

import { Text } from "@adobe/react-spectrum";
import { register, attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField, ListBox, Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AEMHeadless from "@adobe/aem-headless-client-js";
import { useParams, navigate } from "react-router-dom";
import Search from "@spectrum-icons/workflow/Search";
import axios from "axios";

function CfSelectExampleForm(props) {
  const navigate = useNavigate();
  let aemHeadlessClient; // AEM Headless client
  const [authToken, setAuthToken] = React.useState("");
  const [conn, setConn] = useState();
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  let [claimName, setClaimName] = React.useState("");
  const [relatedClaimSearchText, setRelatedClaimSearchText] = useState("");

  const handleGoBack = () => {
    navigate('/');
  };

  const handleClaimNarrow = (e) => {
    e.preventDefault;
    console.info("claim narrow value",relatedClaimSearchText);

    //TODO: call SITEs CF search curl -i -X GET \
    // 'https://{bucket}.adobeaemcloud.com/adobe/sites/cf/fragments/search?cursor=string&limit=1&query=%22{%0A%20%20%20%22filter%22%3A%20{%0A%20%20%20%20%20%20%20%22created%22%3A{%0A%20%20%20%20%20%20%20%20%20%20%20%22by%22%3A%20%5B%22admin%22%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22after%22%3A%20%222019-10-12T07%3A20%3A50.52Z%22%0A%20%20%20%20%20%20%20}%2C%0A%20%20%20%0A%20%20%20%20%20%20%20%22path%22%3A%20%22%2Fcontent%2Fdam%22%2C%0A%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%22modelIds%22%3A%20%5B%22L2NvbmYvd2tuZC1zaGFyZWQvc2V0dGluZ3MvZGFtL2NmbS9tb2RlbHMvYXV0aG9y%22%5D%0A%20%20%20}%0A}%22' \
    // -H 'Authorization: Bearer <YOUR_JWT_HERE>'

    //update table results
  };

  useEffect(() => {
    // Init claims
    const fakeClaims = [
      {id: 1, firstUseDate: '6/7/2020', claimText: 'Clinically Proven to Reduce Symptoms by 50% in Just 4 Weeks!'},
      {id: 2, firstUseDate: '4/7/2021', claimText: 'Trusted by Healthcare Professionals Worldwide for Over 20 Years'},
      {id: 3, firstUseDate: '11/20/2010', claimText: 'Experience Relief with Our Fast-Acting Formula – Starts Working in Just 30 Minutes!'},
      {id: 4, firstUseDate: '1/18/2016', claimText: 'Over 90% Patient Satisfaction Rate – Join the Thousands Who Trust Our Medication'},
      {id: 5, firstUseDate: '1/18/2016', claimText: 'Backed by Cutting-Edge Research and Innovation – Your Health, Our Priority'}
    ];
    setClaims(fakeClaims);

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

  useEffect(() => {
    async function fetchClaims() {
      console.log("authToken in fetch is ========== ", authToken);

      if(!aemHeadlessClient){
        aemHeadlessClient = new AEMHeadless({
          serviceURL: "https://author-p142461-e1463137.adobeaemcloud.com",
          endpoint: "/graphql",
          auth: `${authToken}` });
      }

      let getData
      try {
        getData = await aemHeadlessClient.runPersistedQuery('global/allClaims');
      } catch (e) {
        console.error(e);
      }

      console.log(JSON.stringify(getData, null, 2));
  
      //Todo: pull in some content fragments from demo system
      //todo: rebuild the content fragment data for the picker options
      
      const response = await fetch('https://author-p142461-e1463137.adobeaemcloud.com/graphql/execute.json/global/allClaims',{
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${authToken}`
        }
       });
      const data = await response.json();
      
    
      setClaims([{id:123, name:'test claim 1'}]);
    }

    fetchClaims();
  }, []);

  let onSubmit = (e) => {
    e.preventDefault();

    // TODO: write to fusion webhook to handle form submit  

    alert(selectedSecondaryClaimId);
  };

  return (
    <>
    <Flex direction="column" gap="size-100" margin="size-200">
      {props.isLocal ? (
      <Flex direction="row" gap={8}>
        <Button variant="accent" onPress={handleGoBack} >Back</Button>
      </Flex>
      ) : ('')}
      <View borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
        <Text>Primary Claim {claimName}</Text>
        <Form onSubmit={onSubmit} >
          <TextField label="Claim Name" value={claimName} onChange={setClaimName} />
          <Picker isRequired label="Choose primary claim" onSelectionChange={setSelectedSecondaryClaimId} items={claims}>
            {(item) => <Item>{item.name}</Item>}
          </Picker>
          <Flex direction="row" gap={8} alignItems="end">
            <TextField label="Related Claim Search" onChange={setRelatedClaimSearchText}/>
            <Button variant="primary" onPress={handleClaimNarrow}>
              <Search />
              <Text>Search</Text>
            </Button>
          </Flex>
          <TableView
            aria-label="Example table with multiple selection"
            selectionMode="multiple"
            defaultSelectedKeys={['2', '4']}
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
        <ButtonGroup>
          <Button type="submit" variant="primary">Save</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonGroup>
        </Form>
      </View>
    </Flex>
    </>
  );
}

export default CfSelectExampleForm;
