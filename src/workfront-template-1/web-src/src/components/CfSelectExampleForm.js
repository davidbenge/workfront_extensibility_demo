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
  let [imsToken, setAuthToken] = React.useState("");
  // CF claim options
  let [claims, setClaims] = React.useState([]);
  let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] = React.useState(null);
  let [claimName, setClaimName] = React.useState("");
  let [imsOrg, setImsOrg] = React.useState("33C1401053CF76370A490D4C@AdobeOrg");
  let [imsClientId, setImsClientId] = React.useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
  let [repositoryId, setRepositoryId] = React.useState("delivery-p142461-e1463137.adobeaemcloud.com");
  const [isOpen, setIsOpen] = React.useState(false);

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

  return (
    <DialogTrigger type="fullscreen" isOpen={isOpen}>
      <ActionButton onPress={() => setIsOpen(true)}>Show Fragment Selector</ActionButton>
      <ContentFragmentSelector
          orgId={imsOrg}
          imsToken={imsToken}
          repoId={repoId}
          isOpen={isOpen}
          filters={{
              folder: "/content/dam",
              status: ["PUBLISHED", "MODIFIED"],
              tag: [
                      {
                          id: "1:",
                          name: "1",
                          path: "/content/cq:tags/1",
                          description: "",
                      },
                  ],
          }}
          readonlyFilters={{
              tag: [
                      {
                          id: "1:",
                          name: "1",
                          path: "/content/cq:tags/1",
                          description: "",
                      },
                  ],
          }}
          onDismiss={() => setIsOpen(false)}
          onSubmit={({ contentFragments, domainNames }) => {
              const selectedContentFragment = contentFragments[0];
              const usedDomainName = domainNames[0];
              const contentFragmentAlert = `Example link: https://${usedDomainName}${selectedContentFragment.path}.cfm.gql.json`;
              alert(contentFragmentAlert);
          }}
      />
    </DialogTrigger>
  );
}

export default CfExampleForm;