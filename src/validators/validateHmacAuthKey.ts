import config from '../config'

export default (hmacAuthKey): boolean => config.hmacAuthKey === hmacAuthKey
