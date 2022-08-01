import Response from 'src/response'
import { NextApiRequest, NextApiResponse } from 'next'

function TestAuthHandler(req: NextApiRequest, res: NextApiResponse) {
	Response.json(res, req.body.data || 'Hello Future!')
}

export default TestAuthHandler
