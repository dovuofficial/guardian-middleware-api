import credentials from './validateCredentials'
import ecologicalProject from './validateEcologicalProjectApplication'

export default {
	login: credentials,
	createAccount: credentials,
	ecologicalProject,
}
