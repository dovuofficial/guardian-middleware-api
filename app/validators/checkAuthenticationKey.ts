import Config from '../config'

const checkAuthenticationKey = (authenticationKey): boolean => {
	return Config.authenticationKey === authenticationKey
}

export default checkAuthenticationKey
