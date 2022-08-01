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
 * 'x-content-sha256' is sent in the header as a base64 encoded sha256 hash of the request body
 * 'x-signature' is sent in the header as a base64 encoded sha256 HMAC
 */

function withHmac(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const { method: verb, headers, body, url } = req

		const {
			host,
			'x-signature': headerSignature,
			'x-date': headerDate,
			'x-content-sha256': headerContentHash,
		} = headers

		if (!host) {
			return Response.unauthorised(res, 'Missing "host" in header')
		}

		if (!headerSignature) {
			return Response.unauthorised(
				res,
				'Missing HMAC "signature" in header'
			)
		}

		if (!headerDate) {
			return Response.unauthorised(
				res,
				'Missing "x-date" in header. This should be an ISO 8601 UTC date string'
			)
		}

		if (typeof headerDate !== 'string') {
			return Response.unauthorised(
				res,
				'"x-date" header should be an ISO 8601 UTC date string'
			)
		}

		let requestDate
		try {
			requestDate = new Date(headerDate as string)
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

		let stringToSign = ''
		if (body) {
			const contentHash = Crypto.createHash('sha256')
				.update(JSON.stringify(body))
				.digest('base64')

			if (body && contentHash !== headerContentHash) {
				return Response.unauthorised(
					res,
					'Request body hash does not match the hash provided in the header for "x-content-sha256"'
				)
			}

			stringToSign = `${verb}\n${url}\n${headerDate};${host};${contentHash}`
		} else {
			stringToSign = `${verb}\n${url}\n${headerDate};${host}`
		}

		const isSignatureValid = hmac.validateSignature(
			stringToSign,
			headerSignature as string
		)

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
