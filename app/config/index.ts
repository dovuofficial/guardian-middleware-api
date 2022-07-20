'use strict'
type OpenApiDefinition = {
	info: {
		title: string
		version: string
	}
	openapi: string
}

const openApiDefinition: OpenApiDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Guardian Middleware API',
		version: '0.0.1',
	},
}

export type Config = {
	authenticationKeyValid: () => boolean
	network: string
	accountId: string
	privateKey: string
	authenticationKey: string
	encryptionKey: string
	apiUrl: string
	hideStatus: string
	webhookUrl: string
	openApiDefinition: OpenApiDefinition
}

const {
	HEDERA_NETWORK,
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY,
	API_URL,
	HIDE_STATUS,
	WEBHOOK_URL,
	ENCRYPTION_KEY,
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const authenticationKeyValid = (): boolean =>
	API_SECRET_KEY && API_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH

const config: Config = {
	authenticationKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_ACCOUNT_ID,
	privateKey: HEDERA_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	encryptionKey: ENCRYPTION_KEY,
	apiUrl: API_URL,
	hideStatus: HIDE_STATUS,
	webhookUrl: WEBHOOK_URL,
	openApiDefinition,
}

export default config
