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
    const guestConnection = await register({
      methods:{
        id: extensionId,
        secondaryNav:{
          TASK:{
            getItems(){
              return [
                {
                  id: "assetSelectExample1",
                  label: "Asset Select Form Example 1",
                  icon: cfFormIcon,
                  url: "/asset_select_example_form"
                },
                {
                  id: "assetSelectExample2",
                  label: "Asset Select Form Example 1",
                  icon: cfFormIcon,
                  url: "/asset_select_example_form2"
                },
                {
                  id: "cfExampleForm1",
                  label: "CF Form Example",
                  icon: cfFormIcon,
                  url: "/cf_example_form"
                },
                {
                  id: "cfExampleForm2",
                  label: "CF Select Example",
                  icon: cfFormIcon,
                  url: "/cf_select_example_form"
                }
              ];
            }
          }
        }
      }
    });
  };
  init().catch(console.error);

  return (
    <Flex wrap gap="size-200" margin="size-200">
      <Button variant="accent" onPress={handleNavAssetClick}>Asset Select Demo passed auth</Button>
      <Button variant="accent" onPress={handleNavAsset2Click}>Asset Select Demo login</Button>
      <Button variant="accent" onPress={handleNavCfFormClick}>CF Demo</Button>
      <Button variant="accent" onPress={handleNavCfSelectFormClick}>CF Select Demo</Button>
    </Flex>
  )
}

export default ExtensionRegistration;
