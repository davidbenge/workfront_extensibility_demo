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

function AssetMfeExampleForm2(props) {
  const navigate = useNavigate();

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
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = conn?.sharedContext?.get("auth");
      setAuthToken(auth.imsToken); // set the auth token 
      console.info("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.
      console.info("HOST", JSON.stringify(conn?.sharedContext?.get("host"),null, 2)); //host context passed down from hosting workfront.
    } 
  }, [conn]);

  
  return (
    <Flex direction="column" gap="size-100" margin="size-200">
      <Flex direction="row" gap={8}>
        <Button variant="accent" onPress={handleGoBack} >Back</Button>
      </Flex>
      <Text>TODO</Text>
    </Flex>
  );
}

export default AssetMfeExampleForm2;
