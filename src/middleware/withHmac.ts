import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { generateStringToSign, validateSignature } from 'src/utils/hmac'
import config from 'src/config'
import language from 'src/constants/language'

/**
 * We follow Microsoft's implementation of HMAC for securing the API.
 * https://docs.microsoft.com/en-us/azure/azure-app-configuration/rest-api-authentication-hmac
 *
 * Please see the README for more details.
 *
 * The HMAC hash is sent in the 'x-signature' property in the header
 * 'x-date' is sent in the header as an ISO 8601 UTC date string
 * 'x-content-sha256' is sent in the header as a base64 encoded sha256 hash of the request body if applicable
 * 'x-signature' is sent in the header as a base64 encoded sha256 HMAC
 */

function withHmac(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (!config.hmacEnabled) {
			return handler(req, res)
		}

		const { method: verb, headers, body, url } = req

		const {
			host,
			'x-signature': headerSignature,
			'x-date': headerDate,
			'x-content-sha256': headerContentHash,
		} = headers

		if (!host) {
			return Response.unauthorised(language.middleware.hmac.noHost)
		}

		if (!headerSignature) {
			return Response.unauthorised(language.middleware.hmac.noSignature)
		}

		if (!headerDate) {
			return Response.unauthorised(language.middleware.hmac.noDate)
		}

		if (typeof headerDate !== 'string') {
			return Response.unauthorised(language.middleware.hmac.invalidDate)
		}

		if (body && !headerContentHash) {
			return Response.unauthorised(language.middleware.hmac.noContentHash)
		}

		let requestDate
		try {
			requestDate = new Date(headerDate as string)
		} catch (e) {
			return Response.unauthorised(language.middleware.hmac.invalidDate)
		}

		const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

		if (requestDate.getTime() < fifteenMinutesAgo.getTime()) {
			return Response.unauthorised(language.middleware.hmac.requestTooOld)
		}

		const stringToSign = generateStringToSign(
			verb,
			host,
			url,
			headerDate,
			headerContentHash as string
		)

		const isSignatureValid = validateSignature(
			stringToSign,
			headerSignature as string,
			config.hmacAuthKey
		)

		if (!isSignatureValid) {
			return Response.unauthorised(
				language.middleware.hmac.invalidSignature
			)
		}

		return handler(req, res)
	}
}

export default withHmac
