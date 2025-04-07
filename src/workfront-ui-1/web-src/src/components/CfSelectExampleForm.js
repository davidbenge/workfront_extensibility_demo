/*
 * <license header>
 *
 * add in CF fragment selector
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	TableView,
	TableHeader,
	TableBody,
	Column,
	Row,
	Cell,
	Flex,
} from "@adobe/react-spectrum";
import CopyIcon from "@spectrum-icons/workflow/Copy";
import { attach } from "@adobe/uix-guest";
import authTokenManager from "../utils/authTokenManager";
import { extensionId } from "./Constants";

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

	const [conn, setConn] = useState();
	let [imsOrg, setImsOrg] = useState("33C1401053CF76370A490D4C@AdobeOrg");
	let [repoId, setRepositoryId] = useState(
		"author-p111858-e1309034.adobeaemcloud.net"
	);
	const [isOpen, setIsOpen] = useState(true);
	const [contentFragments, setContentFragments] = useState([]);
	// const AEM_HOST = "https://author-p111858-e1309055.adobeaemcloud.net"; //STAGE
	// const AEM_HOST = "https://author-p111858-e1309034.adobeaemcloud.net"; //PROD

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
			// Using the connection created above, grab the document details from the host tunnel.
			//  conn?.host?.document?.getDocumentDetails().then(setDocDetails);
			const auth = conn?.sharedContext?.get("auth");
			console.log("###### auth ######", conn, auth);
			const token = auth.imsToken;
			setAuthToken(token); // set the auth token
			console.info(
				"authToken passed down from WF",
				token,
				authTokenManager.decodedToken
			); //auth token passed down from hosting workfront.
			console.info(
				"HOST",
				JSON.stringify(conn?.sharedContext?.get("host"), null, 2)
			); //host context passed down from hosting workfront.

			// This should be used only if the token is a valid one for the CFS MFE
			const CFSProps = {
				orgId: imsOrg,
				repoId: repoId,
				imsToken: authToken,
				env: "PROD",
			};

			const CFSWithAuthFlowProps = {
				orgId: imsOrg,
				imsClientId: authTokenManager.getDecodedTokenData().client_id,
				imsScope: authTokenManager.getDecodedTokenData().scope,
			};

			initContentFragmentSelector({
				// ...CFSProps,
				...CFSWithAuthFlowProps,
				isOpen: isOpen,
				filter: {
					folder: "/content/dam",
					status: ["PUBLISHED", "MODIFIED"],
				},
				onDismiss: () => setIsOpen(false),
				onSubmit: ({ contentFragments }) => {
					const selectedContentFragment = contentFragments[0];
					console.log("Selection", contentFragments);
					setContentFragments((prev) => [
						...prev,
						selectedContentFragment.path,
					]);
					setIsOpen(false);
				},
			});
		}
	}, [conn, isOpen]);

	async function initContentFragmentSelector(contentFragmentSelectorProps) {
		if (!contentFragmentSelectorProps.isOpen) {
			const fragmentSelectorContainer = document.getElementById(
				"cf-selector-container"
			);
			fragmentSelectorContainer.innerHTML = "";
			fragmentSelectorContainer.style.width = "100%";
			fragmentSelectorContainer.style.height = "100%";

			return;
		}

		// Load the script dynamically
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
				const {
					renderContentFragmentSelector,
					renderContentFragmentSelectorWithAuthFlow,
				} = window.PureJSSelectors;
				renderContentFragmentSelectorWithAuthFlow(
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
				<TableView
					aria-label="Example table with single selection"
					selectionMode="single"
				>
					<TableHeader>
						<Column>Path</Column>
						<Column>Actions</Column>
					</TableHeader>
					<TableBody>
						{contentFragments.map((path, index) => (
							<Row key={index}>
								<Cell>{path}</Cell>
								<Cell>
									<Button
										variant="ghost"
										onPress={() => copyToClipboard(path)}
										aria-label="Copy to clipboard"
									>
										<CopyIcon />
									</Button>
								</Cell>
							</Row>
						))}
					</TableBody>
				</TableView>
			)}
		</Flex>
	);
}

export default CfExampleForm;
