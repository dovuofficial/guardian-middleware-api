export interface Config {
	authenticationKeyValid: () => boolean
	network: string
	accountId: string
	privateKey: string
	authenticationKey: string
	encryptionKey: string
	apiUrl: string
	hideStatus: string
	webhookUrl: string
	guardianApiUrl: string
}

const {
	HEDERA_NETWORK = 'testnet',
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY,
	API_URL,
	HIDE_STATUS,
	WEBHOOK_URL,
	ENCRYPTION_KEY,
	GUARDIAN_API_URL,
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const authenticationKeyValid = (): boolean =>
	Boolean(API_SECRET_KEY && API_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH)

export default {
	authenticationKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_ACCOUNT_ID,
	privateKey: HEDERA_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	encryptionKey: ENCRYPTION_KEY,
	apiUrl: API_URL,
	hideStatus: HIDE_STATUS,
	webhookUrl: WEBHOOK_URL,
	guardianApiUrl: GUARDIAN_API_URL,
}
