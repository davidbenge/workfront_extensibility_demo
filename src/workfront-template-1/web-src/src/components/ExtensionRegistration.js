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

  function handleNavAssetClick(event) {
    navigate('/assetexampleform', { replace: true });
  }

  function handleNavCfFormClick(event) {
    navigate('/cfexampleform', { replace: true });
  }

  const init = async () => {
    const guestConnection = await register({
      methods:{
        id: extensionId,
        mainMenu:{
          getItems(){
            return [
              {
                id: "cfFormExample",
                label: "Workfront CF Form Example",
                icon: cfFormIcon,
                url: "/cfexampleform"
              }
            ];
          }
        }
      }
    });
  };
  init().catch(console.error);

  return (
    <Flex wrap gap="size-200" margin="size-200">
      <Button variant="accent" onPress={handleNavAssetClick}>Asset Select Demo</Button>
      <Button variant="accent" onPress={handleNavCfFormClick}>CF Demo</Button>
    </Flex>
  )
}

export default ExtensionRegistration;
