import authToken from './validateHmacAuthKey'
import credentials from './validateCredentials'
import ecologicalProject from './validateEcologicalProjectApplication'

export default {
	authToken,
	login: credentials,
	createAccount: credentials,
	ecologicalProject,
}
