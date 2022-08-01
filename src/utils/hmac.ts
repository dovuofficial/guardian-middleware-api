import config from 'src/config'
import Crypto from 'crypto'

function generateHmac(payloadAsString: string): string {
	if (typeof payloadAsString !== 'string') {
		throw Error('Your payload object must be converted in to a string')
	}

	return Crypto.createHmac('sha256', config.hmacAuthKey)
		.update(payloadAsString)
		.digest('base64')
}

function validateSignature(
	payloadAsString: string,
	signature: string
): boolean {
	const hash = generateHmac(payloadAsString)

	return hash === signature
}

const hmac = {
	generateHmac,
	validateSignature,
}

export default hmac
