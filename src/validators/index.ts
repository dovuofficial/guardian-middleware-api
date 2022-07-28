import authToken from './validateAuthenticationKey'
import credentials from './validateCredentials'
import ecologicalProject from './validateEcologicalProjectApplication'

export default {
	authToken,
	login: credentials,
	createAccount: credentials,
	ecologicalProject,
}
