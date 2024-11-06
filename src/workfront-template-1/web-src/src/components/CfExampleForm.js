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
import AEMHeadless from "@adobe/aem-headless-client-js";

function CfSelectExampleForm() {
  const navigate = useNavigate();
  let aemHeadlessClient; // AEM Headless client
  let [authToken, setAuthToken] = React.useState("");

  function handleBackClick(event) {
    navigate('/', { replace: true });
  }

  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      metadata
    });

    console.log("guestConnection", JSON.stringify(guestConnection, null, 2));
  };
  init().catch(
    console.error
  );

  useEffect(() => {
    async function fetchClaims() {
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
        method:'GET',
        headers: {
          "Authorization":`Bearer ${authToken}`
        },
       });
      const data = await response.json();
      
    
      setClaims([{id:123, name:'test claim 1'}]);
    }

    fetchClaims();
  }, []);

  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  let [claimName, setClaimName] = React.useState("");

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
