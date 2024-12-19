/*
 * <license header>
 */

import { Icon, Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import metadata from '../../../../app-metadata.json';
import { extensionId, cfFormIcon } from "./Constants";
import { useNavigate } from 'react-router-dom';
import { Flex, View, Button, TextField } from '@adobe/react-spectrum';

function ExtensionRegistration(props) {
  const isLocal = props.isLocal; //flag to tell app its running local.

  const init = async () => {
    // Extension item config array. We keep this as an array because we were toggling the extension id and name 
    // so we could run STAGE and LOCAL on same workfront instance without collisions. 
    // as a standalone array this allows us to easily dump to console for debugging
    //
    const mainExtensionConfig = [
      {
        id: (isLocal ? 'assetSelectExample1_LDEV' : 'assetSelectExample1'),
        label: (isLocal ? 'Asset Select Form Example LDEV' : 'Asset Select Form Example'),
        icon: cfFormIcon,
        url: "/index.html#/asset_select_example_form"
      },
      {
        id: (isLocal ? 'assetSelectExample2_LDEV' : 'assetSelectExample2'),
        label: (isLocal ? 'Asset Select Form Example 2 LDEV' : 'Asset Select Form Example 2'),
        icon: cfFormIcon,
        url: "/index.html#/asset_select_example_form2"
      }
    ];

    const guestConnection = await register({
      methods:{
        id: extensionId,
        mainMenu: {
          getItems(){
            return mainExtensionConfig
          }
        },
        secondaryNav:{
          TASK:{
            getItems(){
              return [
                {
                  id: (isLocal ? 'cfExampleTableForm1_LDEV' : 'cfExampleTableForm1'),
                  label: (isLocal ? 'CF Table Form Example LDEV' : 'CF Table Form Example'),
                  icon: cfFormIcon,
                  url: "/index.html#/cf_select_table_example_form"
                },
                {
                  id: (isLocal ? 'cfExampleForm2_LDEV' : 'cfExampleForm2'),
                  label:  (isLocal ? 'CF MFE Select Example LDEV' : 'CF MFE Select Example'),
                  icon: cfFormIcon,
                  url: "/index.html#/cf_select_example_form"
                },
                {
                  id: (isLocal ? 'showValues_LDEV' : 'showValues'),
                  label:  (isLocal ? 'Show Values LDEV' : 'Show Values'),
                  icon: cfFormIcon,
                  url: "/index.html#/show_task_values"
                }
              ]
            }
          },
          PROJECT:{
            getItems(){
              return [
                {
                  id: (isLocal ? 'projectForm1_LDEV' : 'projectForm1'),
                  label: (isLocal ? 'Project Form Example LDEV' : 'Project Form Example'),
                  icon: cfFormIcon,
                  url: "/index.html#/cf_example_form"
                }
              ]
            }
          },
          DOCUMENTS:{
            getItems(){
              return [
                {
                  id: (isLocal ? 'documentExpress_LDEV' : 'documentExpress'),
                  label: (isLocal ? 'Open In Express LDEV' : 'Open In Express'),
                  icon: cfFormIcon,
                  url: "/index.html#/open_in_express"
                }
              ]
            }
          }
        }
      }
    });
    //can add more secondary items for PROJECT, TASK, ISSUE, PORTFOLIO, PROGRAM with same example

  };
  init().catch(console.error);

  return (<Text>Extension Registration</Text>);
}

export default ExtensionRegistration;
