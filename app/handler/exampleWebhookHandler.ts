import Response from '@app/response'
import { NextApiRequest, NextApiResponse } from 'next'

function ExampleWebhookHandler(req: NextApiRequest, res: NextApiResponse) {
	console.log(
		'Example webhook handler for sending consensus responses to your app.'
	)

	// This is a test response and since we don't know the type the request will get we will igore the types here.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	Response.json(res, req.body.data)
}

export default ExampleWebhookHandler
