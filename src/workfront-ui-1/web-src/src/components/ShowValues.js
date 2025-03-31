/*
 * <license header>
 *
 * add in DocumentExpressView
 * add in example form for aem asset selector
 */
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import {
  Flex,
  View,
  Row,
  Cell,
  Form,
  TableView,
  TableHeader,
  Column,
  TableBody,
} from "@adobe/react-spectrum";
import { useState, useEffect } from "react";
import authTokenManager from './utils/authTokenManager';

function ShowValues(props) {
  const [contextProperties, setContextProperties] = useState([]);
  const [conn, setConn] = useState("");
  const [authToken, setAuthTokenState] = useState("");
  // Custom setter that uses authTokenManager
  const setAuthToken = (token) => {
    setAuthTokenState(token);
    authTokenManager.initialize(token);
    console.info("authTokenManager initialized for client_id", authTokenManager.getDecodedTokenData().client_id);
    console.info("authTokenManager initialized with scope", authTokenManager.getDecodedTokenData().scope);
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
      const context = conn?.sharedContext;
      // Using the connection created above, grab the document details from the host tunnel.
      //  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
      const auth = context?.get("auth");
      const objCode = context?.get("objCode");
      const objID = context?.get("objID");
      const hostname = context?.get("hostname");
      const user = (conn?.sharedContext?.get("user")); // {ID: '1', email: 'test@aaa.com'}
      setAuthToken(auth.imsToken); // set the auth token

      const contextValues = [
        { name: "objCode", value: objCode, id: 1 },
        { name: "objID", value: objID, id: 6 },
        { name: "hostname", value: hostname, id: 2 },
        { name: "user.ID", value: user.ID, id: 4 },
        { name: "user.email", value: user.email, id: 5 },
      ];
      setContextProperties(contextValues);
    }
  }, [conn]);

  useEffect(() => {
    if (authToken) {
      console.log("authToken passed down from WF", authToken); //auth token passed down from hosting workfront.

      setContextProperties((prev) => {
        return [...prev, { name: "authToken", value: authToken, id: 3 }];
      });
    }
  }, [authToken]);

  return (
    <>
      <Flex direction="column" gap="size-100" margin="size-200">
        <View
          borderWidth="thin"
          borderColor="dark"
          borderRadius="medium"
          padding="size-250"
        >
          <Form>
            <TableView
              selectionMode="single"
              aria-label="Example table with dynamic content"
            >
              <TableHeader>
                <Column>Property Name</Column><Column>Value</Column>
              </TableHeader>
              <TableBody items={contextProperties}>
                {(item) => (
                  <Row>
                    <Cell>{item['name']}</Cell>
                    <Cell>{item['value']}</Cell>
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