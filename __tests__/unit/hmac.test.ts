import Hmac from 'src/utils/hmac'

const mockResponsePayload = {
	data: {
		foo: 'bar',
		baz: 'qux',
		quux: 'corge',
	},
}

const mockResponseAsString = JSON.stringify(mockResponsePayload)

test('Generate a HMAC signature using a json string', () => {
	const hmac = Hmac.generateHmac(mockResponseAsString)

	expect(typeof hmac).toBe('string')
})

test('Expect exception when hash is generateHmac where the payload is not a string', () => {
	expect(() => Hmac.generateHmac(mockResponsePayload)).toThrow(
		'Your payload object must be converted in to a string'
	)
})

test('Generate a HMAC signature then validate signature hash', () => {
	const hmac = Hmac.generateHmac(mockResponseAsString)
	const isSignatureValid = Hmac.validateSignature(mockResponseAsString, hmac)

	expect(isSignatureValid).toBe(true)
})
