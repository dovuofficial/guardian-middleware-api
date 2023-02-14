interface Config {
	hmacAuthKeyValid: () => boolean
	network: string
	accountId: string
	privateKey: string
	hmacEnabled: boolean
	hmacAuthKey: string
	apiUrl: string
	hideStatus: boolean
	testAuthUrl: string
	testCoolFarmPolicyId: string
	testAgreCalcPolicyId: string
	testGeneralSupplyDocumentationPolicyId: string
	guardianApiUrl: string
	registryUsername: string
	registryPassword: string
	publicTrustChainAccess: boolean
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
	TEST_COOL_FARM_POLICY_ID,
	TEST_AGRECALC_POLICY_ID,
	TEST_GENERAL_SUPPLY_DOCUMENTATION_POLICY_ID,
	GUARDIAN_API_URL,
	STANDARD_REGISTRY_USERNAME,
	STANDARD_REGISTRY_PASSWORD,
	PUBLIC_TRUST_CHAIN_ACCESS,
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const hmacAuthKeyValid = (): boolean =>
	Boolean(HMAC_SECRET_KEY && HMAC_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH)

const booleanValue = (value: string): boolean =>
	Boolean(value && value.toLowerCase() === 'true')

const config: Config = {
	hmacAuthKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_OPERATOR_ACCOUNT_ID,
	privateKey: HEDERA_OPERATOR_PRIVATE_KEY,
	hmacEnabled: booleanValue(HMAC_ENABLED),
	hmacAuthKey: HMAC_SECRET_KEY,
	apiUrl: API_URL,
	hideStatus: booleanValue(HIDE_STATUS),
	testAuthUrl: TEST_AUTH_URL,
	testCoolFarmPolicyId: TEST_COOL_FARM_POLICY_ID,
	testAgreCalcPolicyId: TEST_AGRECALC_POLICY_ID,
	testGeneralSupplyDocumentationPolicyId:
		TEST_GENERAL_SUPPLY_DOCUMENTATION_POLICY_ID,
	guardianApiUrl: GUARDIAN_API_URL,
	registryUsername: STANDARD_REGISTRY_USERNAME,
	registryPassword: STANDARD_REGISTRY_PASSWORD,
	publicTrustChainAccess: booleanValue(PUBLIC_TRUST_CHAIN_ACCESS),
}

export default config
