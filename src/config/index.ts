export interface Config {
	authenticationKeyValid: () => boolean
	network: string
	accountId: string
	privateKey: string
	authenticationKey: string
	encryptionKey: string
	apiUrl: string
	hideStatus: string
	testAuthUrl: string
	guardianApiUrl: string
}

const {
	HEDERA_NETWORK = 'testnet',
	HEDERA_OPERATOR_ACCOUNT_ID,
	HEDERA_OPERATOR_PRIVATE_KEY,
	API_SECRET_KEY,
	API_URL,
	HIDE_STATUS,
	TEST_AUTH_URL,
	ENCRYPTION_KEY,
	GUARDIAN_API_URL,
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const authenticationKeyValid = (): boolean =>
	Boolean(API_SECRET_KEY && API_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH)

export default {
	authenticationKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_OPERATOR_ACCOUNT_ID,
	privateKey: HEDERA_OPERATOR_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	encryptionKey: ENCRYPTION_KEY,
	apiUrl: API_URL,
	hideStatus: HIDE_STATUS,
	testAuthUrl: TEST_AUTH_URL,
	guardianApiUrl: GUARDIAN_API_URL,
}
