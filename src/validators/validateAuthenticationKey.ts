import config from '../config'

export default (authenticationKey): boolean =>
	config.authenticationKey === authenticationKey
