import config from '../config'

const checkAuthenticationKey = (authenticationKey): boolean =>
	config.authenticationKey === authenticationKey

export default checkAuthenticationKey
