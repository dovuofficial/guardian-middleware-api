import { NextApiRequest, NextApiResponse } from 'next'

const openApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const openApiSpec = await import('@app/spec/openapi.json')
	res.status(200).json(openApiSpec)
}
export default openApiHandler
