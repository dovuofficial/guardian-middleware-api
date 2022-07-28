import config from 'src/config'
import Crypto from 'crypto'

/*
 * The webhook mechanism requires a HMAC hash to ensure the source of any
 * consensus message, to quickly check for validity.
 *
 * This HMAC hash is sent in the 'x-signature' property in the header, when
 * sent to the webhook URL.
 *
 * Unless the `x-api-key` has been compromised only the serverless client
 * and the server will be able to duplicate the signature.
 */

function generateHmac(payloadAsString): string {
	if (typeof payloadAsString !== 'string') {
		throw Error('Your payload object must be converted in to a string')
	}

	return Crypto.createHmac('sha256', config.authenticationKey)
		.update(payloadAsString)
		.digest('base64')
}

function validateSignature(payloadAsString, signature): boolean {
	const hash = generateHmac(payloadAsString)

	return hash === signature
}

const hmac = {
	generateHmac,
	validateSignature,
}

export default hmac
