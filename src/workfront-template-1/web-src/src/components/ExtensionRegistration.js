/*
 * <license header>
 */

import { Icon, Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import metadata from '../../../../app-metadata.json';
import { extensionId, cfFormIcon } from "./Constants";
import { useNavigate } from 'react-router-dom';
import { Flex, View, Button, TextField } from '@adobe/react-spectrum';

function ExtensionRegistration() {
  const navigate = useNavigate();
  const isLocal = window.location.href.indexOf("localhost") > -1 ? true : false; //flag to tell app its running local.

  function handleNavAssetClick(event) {
    navigate('/asset_select_example_form', { replace: true });
  }

  function handleNavAsset2Click(event) {
    navigate('/asset_select_example_form2', { replace: true });
  }

  function handleNavCfFormClick(event) {
    navigate('/cf_example_form', { replace: true });
  }

  function handleNavCfSelectFormClick(event) {
    navigate('/cf_select_example_form', { replace: true });
  }

  const init = async () => {
    // Extension item config array. We keep this as an array because we were toggling the extension id and name 
    // so we could run STAGE and LOCAL on same workfront instance without collisions. 
    // as a standalone array this allows us to easily dump to console for debugging
    //
    const extensionConfig = [
      {
        id: (isLocal ? 'assetSelectExample1_LDEV' : 'assetSelectExample1'),
        label: (isLocal ? 'Asset Select Form Example LDEV' : 'Asset Select Form Example'),
        icon: cfFormIcon,
        url: "/asset_select_example_form"
      },
      {
        id: (isLocal ? 'assetSelectExample2_LDEV' : 'assetSelectExample2'),
        label: (isLocal ? 'Asset Select Form Example 2 LDEV' : 'Asset Select Form Example 2'),
        icon: cfFormIcon,
        url: "/asset_select_example_form2"
      },
      {
        id: (isLocal ? 'cfExampleForm1_LDEV' : 'cfExampleForm1'),
        label: (isLocal ? 'CF Form Example LDEV' : 'CF Form Example'),
        icon: cfFormIcon,
        url: "/cf_example_form"
      },
      {
        id: (isLocal ? 'cfExampleForm2_LDEV' : 'cfExampleForm2'),
        label:  (isLocal ? 'CF Select Example LDEV' : 'CF Select Example'),
        icon: cfFormIcon,
        url: "/cf_select_example_form"
      }
    ];

    const guestConnection = await register({
      methods:{
        id: extensionId,
        secondaryNav:{
          TASK:{
            getItems(){
              return extensionConfig
            }
          }
        }
      }
    });

    // dumping config to console for easy debugging of registration conflicts
    console.info("Extension registration",JSON.stringify(extensionConfig,null,2));
  };
  init().catch(console.error);

  return (
    <Flex wrap gap="size-200" margin="size-200">
      <Button variant="accent" onPress={handleNavAssetClick}>Asset Select Demo passed auth{(isLocal ? ' LDEV' : '')}</Button>
      <Button variant="accent" onPress={handleNavAsset2Click}>Asset Select Demo login{(isLocal ? ' LDEV' : '')}</Button>
      <Button variant="accent" onPress={handleNavCfFormClick}>CF Demo{(isLocal ? ' LDEV' : '')}</Button>
      <Button variant="accent" onPress={handleNavCfSelectFormClick}>CF Select Demo{(isLocal ? ' LDEV' : '')}</Button>
    </Flex>
  )
}

export default ExtensionRegistration;
