import Config from '../config'

const checkAuthenticationKey = (authenticationKey) => {
	return Config.authenticationKey === authenticationKey
}

export default checkAuthenticationKey
