import Response from 'src/response'
import { NextApiRequest, NextApiResponse } from 'next'

function ExampleWebhookHandler(req: NextApiRequest, res: NextApiResponse) {
	Response.json(res, req.body.data)
}

export default ExampleWebhookHandler
