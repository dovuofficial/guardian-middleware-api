import credentials from './validateCredentials'
import projectRegistration from './validateProjectRegistrationApplication'

export default {
	login: credentials,
	createAccount: credentials,
	projectRegistration,
}
