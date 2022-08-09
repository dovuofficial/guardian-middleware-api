import Tags from './tags'
import Roles from './roles'

export interface Config {
	hmacAuthKeyValid: () => boolean
	network: string
	accountId: string
	privateKey: string
	hmacEnabled: boolean
	hmacAuthKey: string
	encryptionKey: string
	apiUrl: string
	hideStatus: string
	testAuthUrl: string
	guardianApiUrl: string
	registryUsername: string
	registryPassword: string
	roles: object
}

export enum Role {
	STANDARD_REGISTRY = 'ADMINISTRATOR',
	VERIFIER = 'VERIFIER',
	REGISTRANT = 'REGISTRANT',
}

export enum MRV {
	AGRECALC = 'agrecalc',
	COOL_FARM_TOOL = 'cool-farm-tool',
}

const {
	HEDERA_NETWORK = 'testnet',
	HEDERA_OPERATOR_ACCOUNT_ID,
	HEDERA_OPERATOR_PRIVATE_KEY,
	HMAC_ENABLED = 'true',
	HMAC_SECRET_KEY,
	API_URL,
	HIDE_STATUS,
	TEST_AUTH_URL,
	ENCRYPTION_KEY,
	GUARDIAN_API_URL,
	STANDARD_REGISTRY_USERNAME,
	STANDARD_REGISTRY_PASSWORD,
	STANDARD_REGISTRY_USERNAME,
	STANDARD_REGISTRY_PASSWORD,
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const hmacAuthKeyValid = (): boolean =>
	Boolean(HMAC_SECRET_KEY && HMAC_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH)

const booleanValue = (value: string): boolean =>
	Boolean(value && value.toLowerCase() === 'true')

export default {
	hmacAuthKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_OPERATOR_ACCOUNT_ID,
	privateKey: HEDERA_OPERATOR_PRIVATE_KEY,
	hmacEnabled: booleanValue(HMAC_ENABLED),
	hmacAuthKey: HMAC_SECRET_KEY,
	encryptionKey: ENCRYPTION_KEY,
	apiUrl: API_URL,
	hideStatus: booleanValue(HIDE_STATUS),
	testAuthUrl: TEST_AUTH_URL,
	guardianApiUrl: GUARDIAN_API_URL,
	registryUsername: STANDARD_REGISTRY_USERNAME,
	registryPassword: STANDARD_REGISTRY_PASSWORD,
	registryUsername: STANDARD_REGISTRY_USERNAME,
	registryPassword: STANDARD_REGISTRY_PASSWORD,
	tags: Tags,
	roles: Roles,
}
