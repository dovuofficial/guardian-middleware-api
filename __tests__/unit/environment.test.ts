import Config from 'src/config'

const {
	HEDERA_OPERATOR_ACCOUNT_ID,
	HEDERA_OPERATOR_PRIVATE_KEY,
	HMAC_SECRET_KEY,
} = process.env

test('Make sure that the config returns the account id', () => {
	expect(Config.accountId).toBe(HEDERA_OPERATOR_ACCOUNT_ID)
})

test('Make sure that the config returns the private key', () => {
	expect(Config.privateKey).toBe(HEDERA_OPERATOR_PRIVATE_KEY)
})

test('Make sure that the config returns the api secret key', () => {
	expect(Config.hmacAuthKey).toBe(HMAC_SECRET_KEY)
})
