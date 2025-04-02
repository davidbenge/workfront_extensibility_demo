/*
 * <license header>
 *
 * add in CF fragment selector
 * add in example form for aem asset selector
 */

import {
	ActionButton,
	DialogTrigger,
	Text,
	Button,
	CopyIcon,
	TableHeader,
	TableBody,
	Row,
	Cell,
	Flex,
} from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from "../../../../app-metadata.json";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { ContentFragmentSelector } from "https://experience.adobe.com/solutions/CQ-sites-content-fragment-selector/static-assets/resources/content-fragment-selector.js";
import authTokenManager from "../utils/authTokenManager";

function CfExampleForm(props) {
	const navigate = useNavigate();
	let [authToken, setAuthTokenState] = useState("");
	// Custom setter that uses authTokenManager
	const setAuthToken = (token) => {
		setAuthTokenState(token);
		authTokenManager.initialize(token);
		console.info(
			"authTokenManager initialized for client_id",
			authTokenManager.getDecodedTokenData().client_id
		);
		console.info(
			"authTokenManager initialized with scope",
			authTokenManager.getDecodedTokenData().scope
		);
	};
	// CF claim options
	let [claims, setClaims] = useState([]);
	let [selectedSecondaryClaimId, setSelectedSecondaryClaimId] =
		useState(null);
	let [claimName, setClaimName] = useState("");
	const [conn, setConn] = useState();
	let [imsOrg, setImsOrg] = useState("33C1401053CF76370A490D4C@AdobeOrg");
	let [imsClientId, setImsClientId] = useState("tmd_asset_selector_poc"); //aem-assets-frontend-1 exc_app tmd_asset_selector_poc
	let [repoId, setRepositoryId] = useState(
		"author-p111858-e1309055.adobeaemcloud.net"
	);
	const [isOpen, setIsOpen] = useState(true);
	const [localNavVisible, setLocalNavVisible] = useState(true);
	const [contentFragments, setContentFragments] = useState([]);
	const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.net"; //STAGE
	//const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.net"; //PROD

	const handleGoBack = () => {
		navigate("/");
	};

	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log("Text copied to clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
			});
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
			setLocalNavVisible(false); // hide the local nav
			// Using the connection created above, grab the document details from the host tunnel.
			//  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
			const auth = conn?.sharedContext?.get("auth");
			const token = auth.imsToken;
			setAuthToken(token); // set the auth token
			console.info("authToken passed down from WF", token); //auth token passed down from hosting workfront.
			console.info(
				"HOST",
				JSON.stringify(conn?.sharedContext?.get("host"), null, 2)
			); //host context passed down from hosting workfront.

			initContentFragmentSelector({
				orgId: imsOrg,
				// "33C1401053CF76370A490D4C@AdobeOrg",
				// "908936ED5D35CC220A495CD4@AdobeOrg",
				imsToken: authToken,
				repoId: repoId,
				// "author-p111858-e1309034.adobeaemcloud.net",
				// "author-p7452-e12433.adobeaemcloud.com",
				// env: "PROD",
				isOpen: isOpen,
				filter: {
					folder: "/content/dam",
					status: ["PUBLISHED", "MODIFIED"],
					// tag: [
					// 	{
					// 		id: "1:",
					// 		name: "1",
					// 		path: "/content/cq:tags/1",
					// 		description: "",
					// 	},
					// ],
				},
				readonlyFilters: {
					// tag: [
					// 	{
					// 		id: "1:",
					// 		name: "1",
					// 		path: "/content/cq:tags/1",
					// 		description: "",
					// 	},
					// ],
				},
				onDismiss: () => setIsOpen(false),
				onSubmit: ({ contentFragments, domainNames }) => {
					const selectedContentFragment = contentFragments[0];
					const usedDomainName = domainNames[0];
					const contentFragmentAlert = `Example link: https://${usedDomainName}${selectedContentFragment.path}.cfm.gql.json`;
					console.log("Selection", contentFragments, domainNames);
					setContentFragments((prev) => [
						...prev,
						contentFragmentPath,
					]);
					setIsOpen(false);
				},
			});
		}
	}, [conn]);

	async function initContentFragmentSelector(contentFragmentSelectorProps) {
		// this sucks, i am not proud of this.
		let script = document.createElement("script");
		script.src =
			"https://experience.adobe.com/solutions/CQ-sites-content-fragment-selector/static-assets/resources/content-fragment-selector.js";
		document.body.appendChild(script);

		const fragmentSelectorContainer = document.getElementById(
			"cf-selector-container"
		);

		script.onload = function () {
			// The script has loaded successfully; you can now use its functions or variables

			(async () => {
				const { renderContentFragmentSelector } =
					window.PureJSSelectors;
				renderContentFragmentSelector(
					fragmentSelectorContainer,
					contentFragmentSelectorProps
				);
			})();
		};
	}

	return (
		<Flex direction="column" gap="size-200">
			<div id="cf-selector-container"></div>

			{contentFragments.length > 0 && (
				<Table aria-label="Content Fragment Paths">
					<TableHeader>
						<Column>Path</Column>
						<Column>Actions</Column>
					</TableHeader>
					<TableBody>
						{contentFragments.map((path, index) => (
							<Row key={index}>
								<Cell>{path}</Cell>
							</Row>
						))}
					</TableBody>
				</Table>
			)}
		</Flex>
	);
}

export default CfExampleForm;
