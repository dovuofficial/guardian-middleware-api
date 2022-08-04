const statusCodes = {
	// Default success
	OK: 200,

	// Generic catch-all bad request, unless the server throws a 500
	BAD_REQUEST: 400,

	// Resource has not been found for a given action, like finding a did for an approval
	NOT_FOUND: 404,

	// Status used when an invalid authentication key is used
	UNAUTHORIZED: 401,

	// Catch requests to valid endpoints not using a valid method
	METHOD_NOT_ALLOWED: 405,

	// Focused on validation, if a check fails this is used
	UNPROCESSIBLE_ENTITY: 422,
}

export default statusCodes
