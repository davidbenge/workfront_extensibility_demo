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
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AEMHeadless from "@adobe/aem-headless-client-js";

function CfSelectExampleForm() {
  const navigate = useNavigate();
  let aemHeadlessClient; // AEM Headless client
  const [authToken, setAuthToken] = React.useState("");
  const [conn, setConn] = useState();
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  let [claimName, setClaimName] = React.useState("");

  function handleBackClick(event) {
    navigate('/', { replace: true });
  }

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
      const auth = connection?.sharedContext?.get("auth");
      setAuthToken(auth.imsToken); // set the auth token 
      console.info("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(connection?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
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
      <Flex direction="row" gap={8}>
        <Button variant="accent" onPress={handleBackClick} >Back</Button>
      </Flex>
      <View borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
        <Text>Primary Claim {claimName}</Text>
        <Form onSubmit={onSubmit} maxWidth="size-3000">
          <TextField label="Claim Name" value={claimName} onChange={setClaimName} />
          <Picker isRequired label="Choose primary claim" onSelectionChange={setSelectedSecondaryClaimId} items={claims}>
            {(item) => <Item>{item.name}</Item>}
          </Picker>
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
