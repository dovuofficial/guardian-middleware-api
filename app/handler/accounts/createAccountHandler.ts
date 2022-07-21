import Response from 'app/response'
import { NextApiRequest, NextApiResponse } from 'next'

async function CreateAccountHandler(req: NextApiRequest, res: NextApiResponse) {
	const { body }: { body: Record<string, unknown> } = req

	const { Guardian } = req.context

	// TODO: Validate the request input
	console.log(`body: ${JSON.stringify(body)}`)

	const userCredentials = {
		...body,
	}

	const userData = {
		...userCredentials,
		// This doesn't need to be a registrant (the API handles the registration)
		role: 'USER',
	}

	// Register user
	await Guardian.account.register(userData)

	console.log('user registered')
	console.log(userData)

	const loginUser = await Guardian.account.login(userCredentials)
	console.log('login user ok')

	const randomKey = await Guardian.demo.randomKey()

	console.log('randomKey generated for user')

	const userProfile = {
		hederaAccountId: randomKey.id,
		hederaAccountKey: randomKey.key,
	}

	console.log(JSON.stringify(userProfile))

	await Guardian.profile.save(
		loginUser.accessToken,
		userProfile,
		userData.username
	)

	Response.json(res, { accessToken: loginUser.accessToken })
}

export default CreateAccountHandler
