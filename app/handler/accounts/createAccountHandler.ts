import { Guardian } from '@app/guardian'
import Response from 'app/response'
import { NextApiRequest, NextApiResponse } from 'next'

type Credentials = {
	username: string
	password: string
}

interface Request extends NextApiRequest {
	context: {
		guardian: Guardian
		engine: Engine
	}
	body: Credentials
}

async function CreateAccountHandler(req: Request, res: NextApiResponse) {
	const { body: userCredentials } = req

	const { guardian } = req.context

	// TODO: Validate the request input
	console.log(`body: ${JSON.stringify(body)}`)

	const userData = {
		...userCredentials,
		// This doesn't need to be a registrant (the API handles the registration)
		role: 'USER',
	}

	// Register user
	await guardian.account.register(userData)

	console.log('user registered')
	console.log(userData)

	const loginUser = await guardian.account.login(userCredentials)
	console.log('login user ok')

	const randomKey = await guardian.demo.randomKey()

	console.log('randomKey generated for user')

	const userProfile = {
		hederaAccountId: randomKey.id,
		hederaAccountKey: randomKey.key,
	}

	console.log(JSON.stringify(userProfile))

	await guardian.profile.save(
		loginUser.accessToken,
		userProfile,
		userCredentials.username
	)

	Response.json(res, { accessToken: loginUser.accessToken })
}

export default CreateAccountHandler
