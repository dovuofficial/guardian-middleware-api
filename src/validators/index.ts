import checkAuthenticationKey from './validateAuthenticationKey'
import credentials from './validateCredentials'

export default {
	authToken: checkAuthenticationKey,
	login: credentials,
	createAccount: credentials,
}
