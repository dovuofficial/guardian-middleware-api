/**
 * 🕊 The purpose of this file is to act as a centralised source
 * of all the tags we use for our policy workflows, when we change
 * the tags in the future through the Guardian we "should" just be
 * able to update the relevent tags here.
 */

export default {
	chooseRole: 'choose_role',
	initialApplicationSubmission: 'create_application',

	// Approve an application
	approveApplicationBlocks: 'registrants_grid',
	approveApplicationBtn: 'approve_registrant_btn',

	// Submit document to make an ecological project
	createEcologicalProject: 'create_farm_form',

	// Submit an MRV for an ecological project as an issue request
	mrvSubmission: 'create_issue_request_form',

	// Approve an ecological project
	approveEcologicalProject: 'approve_farms_grid',
	approveEcologicalProjectBtn: 'approve_farm_button',

	// Approve an MRV request
	approveMrvRequest: 'issue_requests_grid(evident)',
	approveMrvRequestBtn: 'approve_issue_requests_btn',

	// Weirdness needed for all document approval
	approveBtn: 'Option_0',
}
