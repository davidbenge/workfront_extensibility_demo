/*
 * <license header>
 *
 * add in DocumentExpressView
 * add in example form for aem asset selector 
 */
import { Text } from "@adobe/react-spectrum";
import { register, attach} from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import { Picker, Item, Section, Flex, View, Form, ButtonGroup, Button, TextField, TableView, TableHeader, Column, TableBody } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';

function ShowValues(props) {
  const [contextProperties, setContextProperties] = useState([]);
  const [conn, setConn] = useState("");
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const iife = async () => {
        // "attach" the guest application to the host. This creates a "tunnel" from the host app that allows data to be passed to the iframe running this app.
        const connection = await attach({
            id: extensionId,
        });
        console.debug("##### connection #####",JSON.stringify(connection,null,2));
        setConn(connection);
    };
    iife();
  }, []);

  useEffect(() => { 
    if (conn) {
      const context = conn?.sharedContext;
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = context?.get("auth");
      const objCode = context?.get("objCode");
      const hostname = context?.get("hostname");
      setAuthToken(auth.imsToken); // set the auth token 

      const contextValues = [{"name": "objCode", "value": objCode},{"name": "hostname", "value": hostname}];
      setContextProperties(contextValues);
    }
  }, [conn]);

  useEffect(()=>{
    if(authToken){
      console.info("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.
      const contextValues = contextValues.concat({"name": "authToken", "value": authToken});
      setContextProperties(contextValues);
    }
  },[authToken]);

  return (
    <>
    <Flex direction="column" gap="size-100" margin="size-200">
      <View borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
        <Form>
          <TableView
            aria-label="Context data passed into component"
            selectionMode="single"
          >
            <TableHeader>
              <Column>Context property name</Column>
              <Column align="end">value</Column>
            </TableHeader>
            <TableBody items={contextProperties}>
              {item => (
                <Row>
                  <Cell>{item.name}</Cell>
                  <Cell>{item.value}</Cell>
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

export default ShowValues;
