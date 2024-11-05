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

  function handleBackClick(event) {
    navigate('/', { replace: true });
  }

  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      metadata
    });
  };
  init().catch(console.error);

  useEffect(() => {
    async function fetchClaims() {
      if(!aemHeadlessClient){
        aemHeadlessClient = new AEMHeadless({
          serviceURL: "https://author-p142461-e1463137.adobeaemcloud.com",
          endpoint: "/graphql",
          auth: "eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3MzA3ODQyNDA5NjhfMzc1ZTM1YWQtMjM1Ny00YThjLTkyMGQtNTFmYjFmNmEyOTQzX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJhZW0tYXNzZXRzLWZyb250ZW5kLTEiLCJ1c2VyX2lkIjoiNDg1MzI5RDU2NDBDMjZEMzBBNDk1RkEwQDRhYWIyNzIyNjQwYzI2ZDI0OTVmY2EuZSIsInN0YXRlIjoie1wic2Vzc2lvblwiOlwiaHR0cHM6Ly9pbXMtbmExLmFkb2JlbG9naW4uY29tL2ltcy9zZXNzaW9uL3YxL056QmxaV1UyTkdRdFlXWmtPQzAwTTJNMkxUbGhaRFF0WlRGa09URTVabUprTWpOaUxTMDRSVFZGTkRkRVFUUTNNRFpFTlVRMU9Ua3lNREUyUWpoQVFXUnZZbVZKUkFcIn0iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjhFNUU0N0RBNDcwNkQ1RDU5OTIwMTZCOEBBZG9iZUlEIiwiY3RwIjowLCJmZyI6Ilk1VUNJMkhOWFBQN01IVUtITVFWMlhBQTVZPT09PT09Iiwic2lkIjoiMTczMDY5NjIyMjU1OV9mMWNkYzg4Mi1mZWZhLTQ1N2UtOGZhOS1mMWNmMGNjMDVjYzRfdXcyIiwibW9pIjoiODE4N2YzNTMiLCJwYmEiOiJPUkcsTWVkU2VjTm9FVixMb3dTZWMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTczMDc4NDI0MDk2OCIsInNjb3BlIjoiQWRvYmVJRCxvcGVuaWQscmVhZF9vcmdhbml6YXRpb25zLGFiLm1hbmFnZSxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQsZmlyZWZseV9hcGksb3JnLnJlYWQifQ.fBpuUoNpythJiNLJAABMXm_D_8HcdaHB-MLfW48mEDh8yTvGQBSjrauPBfoiNn_saPNvH5e9aOVm2SymgkXxkJEYmgQSP203feaMmpvpML7shnezU6V8z_3PUqbrVebOld1AyUJX6-pBeggfqLzMjsdAkA35ZkEGfNiys8hAv5pivCXfovaZgxpLlUTGiTAdsiJFzbiP-peW3BPMtDkbS5sn41lmcjqaqg4GrWn_9rhF9nN354QQpoYqgAAEpmKdNbLVacctar9EDlSqIkuGdjab_M-uap19ag0VIIHzty8McJ1RfytkxRCBmywkv4cJ-zH4gP6EdXB1lmvT2whm0g" });
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
          "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3MzA3ODQyNDA5NjhfMzc1ZTM1YWQtMjM1Ny00YThjLTkyMGQtNTFmYjFmNmEyOTQzX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJhZW0tYXNzZXRzLWZyb250ZW5kLTEiLCJ1c2VyX2lkIjoiNDg1MzI5RDU2NDBDMjZEMzBBNDk1RkEwQDRhYWIyNzIyNjQwYzI2ZDI0OTVmY2EuZSIsInN0YXRlIjoie1wic2Vzc2lvblwiOlwiaHR0cHM6Ly9pbXMtbmExLmFkb2JlbG9naW4uY29tL2ltcy9zZXNzaW9uL3YxL056QmxaV1UyTkdRdFlXWmtPQzAwTTJNMkxUbGhaRFF0WlRGa09URTVabUprTWpOaUxTMDRSVFZGTkRkRVFUUTNNRFpFTlVRMU9Ua3lNREUyUWpoQVFXUnZZbVZKUkFcIn0iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjhFNUU0N0RBNDcwNkQ1RDU5OTIwMTZCOEBBZG9iZUlEIiwiY3RwIjowLCJmZyI6Ilk1VUNJMkhOWFBQN01IVUtITVFWMlhBQTVZPT09PT09Iiwic2lkIjoiMTczMDY5NjIyMjU1OV9mMWNkYzg4Mi1mZWZhLTQ1N2UtOGZhOS1mMWNmMGNjMDVjYzRfdXcyIiwibW9pIjoiODE4N2YzNTMiLCJwYmEiOiJPUkcsTWVkU2VjTm9FVixMb3dTZWMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTczMDc4NDI0MDk2OCIsInNjb3BlIjoiQWRvYmVJRCxvcGVuaWQscmVhZF9vcmdhbml6YXRpb25zLGFiLm1hbmFnZSxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQsZmlyZWZseV9hcGksb3JnLnJlYWQifQ.fBpuUoNpythJiNLJAABMXm_D_8HcdaHB-MLfW48mEDh8yTvGQBSjrauPBfoiNn_saPNvH5e9aOVm2SymgkXxkJEYmgQSP203feaMmpvpML7shnezU6V8z_3PUqbrVebOld1AyUJX6-pBeggfqLzMjsdAkA35ZkEGfNiys8hAv5pivCXfovaZgxpLlUTGiTAdsiJFzbiP-peW3BPMtDkbS5sn41lmcjqaqg4GrWn_9rhF9nN354QQpoYqgAAEpmKdNbLVacctar9EDlSqIkuGdjab_M-uap19ag0VIIHzty8McJ1RfytkxRCBmywkv4cJ-zH4gP6EdXB1lmvT2whm0g"
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
