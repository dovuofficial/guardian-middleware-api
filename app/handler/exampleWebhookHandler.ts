import Response from '@app/response'
import Hmac from '@app/utils/hmac'
import { NextApiRequest, NextApiResponse } from 'next'

function ExampleWebhookHandler(req: NextApiRequest, res: NextApiResponse) {
	console.log(
		'Example webhook handler for sending consensus responses to your app.'
	)

	const signature = req.headers['x-signature']

	if (!signature) {
		return Response.badRequest(res)
	}

	const stringifyData = JSON.stringify(req.body)
	const isSignatureValid = Hmac.validateSignature(stringifyData, signature)

	if (!isSignatureValid) {
		return Response.badRequest(res)
	}

	// This is a test response and since we don't know the type the request will get we will igore the types here.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	Response.json(res, req.body.data)
}

export default ExampleWebhookHandler
