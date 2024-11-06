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

function CfExampleForm() {
  const navigate = useNavigate();
  let [authToken, setAuthToken] = React.useState("");
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  let [claimName, setClaimName] = React.useState("");

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
  init().catch(console.error);

  useEffect(() => {
    async function fetchClaims() {
      //Todo: pull in some content fragments from demo system
      //todo: rebuild the content fragment data for the picker options
      
      //const response = await fetch('https://json.placeholder.typicode.com/todos');
      //const data = await response.json();
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
        <Text>INSERT THE CF SELECTOR HERE</Text>
      </View>
    </Flex>
    </>
  );
}

export default CfExampleForm;