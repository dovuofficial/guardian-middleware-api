/**
 * 🕊 The purpose of this file is to act as a centralised source
 * of all the guardian specific string we use for our policy workflows,
 * when we change them in the future through the Guardian we "should"
 * just be able to update the relevant strings here.
 */

export enum Tag {
	chooseRole = 'choose_role',
	initialProjectSubmission = 'create_ecological_project',

	// Approve an application
	supplierGrid = 'supplier_grid',
	// supplierGrid = 'save_copy_ecological_project',
	approveProjectBtn = 'approve_supplier_btn',

	// Submit document to make site
	createSite = 'create_site_form',

	sitesForClaim = 'sites_grid',

	// Submit an MRV for an ecological project as an issue request
	mrvSubmission = 'create_claim_request_form',

	// Submit document to make a claim
	createClaim = 'create_claim_request_form',

	// Approve an ecological project
	approveSite = 'approve_sites_grid',
	approveSiteBtn = 'approve_site_button',

	// Approve an MRV request
	// approveMrvRequest = 'claim_requests_grid(evident)',
	approveClaimRequest = 'claim_requests_grid(verifier)',
	approveClaimRequestBtn = 'approve_claim_requests_btn',

	// Weirdness needed for all document approval
	approveBtn = 'Option_0',

	// The Verified Presentation Grid block
	verifiedPresentationGrid = 'vp_grid',

	trustChainBlock = 'trustChainBlock',

	// The Mint Token block
	mintToken = 'mint_token',

	// Path to mint token
	verifierWorkflow = 'verifier_workflow',
	approveIssueRequestsPage = 'approve_claim_requests_page',
	mintTokenParent = 'mint_token',
}

export enum Role {
	STANDARD_REGISTRY = 'ADMINISTRATOR',
	VERIFIER = 'VERIFIER',
	SUPPLIER = 'SUPPLIER',
}

export enum MRV {
	AGRECALC = 'agrecalc',
	COOL_FARM_TOOL = 'cool-farm-tool',
	GENERAL_SUPPLY_DOCUMENTATION = 'general-supply-documentation',
}

export enum EntityState {
	APPROVED = 'Approved',
	WAITING = 'Waiting for approval',
}

/**
 * This enables the (API) client to query the entity at a particular state of the workflow,
 * guardian expects different users to query to submit documents.
 */
export enum QueryRoute {
	PROJECTS = 'projects', // registry only
	APPROVE_SITE = 'approve-site', // registry only
	CREATE_SITE = 'create-site', // supplier only
	CREATE_CLAIM = 'create-claim', // supplier only
	APPROVE_CLAIM = 'approve-claim', // verifier only
}

export const QueryBlockTag = {
	[QueryRoute.PROJECTS]: Tag.supplierGrid,
	[QueryRoute.CREATE_SITE]: Tag.createSite,
	[QueryRoute.CREATE_CLAIM]: Tag.sitesForClaim,
	[QueryRoute.APPROVE_SITE]: Tag.approveSite,
	[QueryRoute.APPROVE_CLAIM]: Tag.approveClaimRequest,
}

export const QueryRole = {
	[QueryRoute.PROJECTS]: Role.STANDARD_REGISTRY,
	[QueryRoute.CREATE_SITE]: Role.SUPPLIER,
	[QueryRoute.CREATE_CLAIM]: Role.SUPPLIER,
	[QueryRoute.APPROVE_SITE]: Role.STANDARD_REGISTRY,
	[QueryRoute.APPROVE_CLAIM]: Role.VERIFIER,
}
