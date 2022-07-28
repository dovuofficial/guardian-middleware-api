import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import hmac from 'src/utils/hmac'
import Crypto from 'crypto'

/**
 * We follow Microsoft's implementation of HMAC for securing the API.
 * https://docs.microsoft.com/en-us/azure/azure-app-configuration/rest-api-authentication-hmac
 *
 * The HMAC hash is sent in the 'x-signature' property in the header
 * 'x-date' is sent in the header as an ISO 8601 UTC date string
 * 'x-host' is sent in the header as the hostname of the request
 * 'x-content-hash' is sent in the header as a base64 encoded sha256 hash of the request body
 * 'x-signature' is sent in the header as a base64 encoded sha256 HMAC
 */

function withHmac(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const { method: verb, headers, body, url } = req

		const { host, 'x-signature': signature, 'x-date': date } = headers

		if (!host) {
			return Response.unauthorised(res, 'Missing "host" in header')
		}

		if (!signature) {
			return Response.unauthorised(
				res,
				'Missing HMAC "signature" in header'
			)
		}

		if (!date) {
			return Response.unauthorised(
				res,
				'Missing "x-date" in header. This should be an ISO 8601 UTC date string'
			)
		}

		if (typeof date !== 'string') {
			return Response.unauthorised(
				res,
				'"x-date" header should be an ISO 8601 UTC date string'
			)
		}

		let requestDate
		try {
			requestDate = new Date(date as string)
		} catch (e) {
			return Response.unauthorised(
				res,
				'"x-date" header should be an ISO 8601 UTC date string'
			)
		}

		const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

		if (requestDate.getTime() < fifteenMinutesAgo.getTime()) {
			return Response.unauthorised(
				res,
				'Request "x-date" is too old. Please re-create the request.'
			)
		}

		const contentHash = Crypto.createHash('sha256')
			.update(JSON.stringify(body))
			.digest('base64')

		const stringToSign = `${verb}\n${url}\n${date};${host};${contentHash}`

		const isSignatureValid = hmac.validateSignature(stringToSign, signature)

		if (!isSignatureValid) {
			return Response.unauthorised(
				res,
				'You are not authorised to access this resource'
			)
		}

		return handler(req, res)
	}
}

export default withHmac
