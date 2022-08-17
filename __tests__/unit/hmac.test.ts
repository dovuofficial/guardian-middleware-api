import { generateHmac, validateSignature } from 'src/utils/hmac'

const mockResponsePayload = {
	data: {
		foo: 'bar',
		baz: 'qux',
		quux: 'corge',
	},
}

const mockResponseAsString = JSON.stringify(mockResponsePayload)
const mockSecretKey = 'secret'

test('Generate a HMAC signature using a json string', () => {
	const hmac = generateHmac(mockResponseAsString, mockSecretKey)

	expect(typeof hmac).toBe('string')
})

test('Expect exception when hash is generateHmac where the payload is not a string', () => {
	// @ts-ignore
	expect(() => generateHmac(mockResponsePayload)).toThrow(
		'Your payload object must be converted in to a string'
	)
})

test('Generate a HMAC signature then validate signature hash', () => {
	const hmac = generateHmac(mockResponseAsString, mockSecretKey)
	const isSignatureValid = validateSignature(
		mockResponseAsString,
		hmac,
		mockSecretKey
	)

	expect(isSignatureValid).toBe(true)
})
