import { GuardianMiddlewareRequest } from '@app/context/useGuardianContext'
import Response from 'app/response'
import { NextApiResponse } from 'next'

type Credentials = {
	username: string
	password: string
}

interface CreateAccountRequest extends GuardianMiddlewareRequest {
	body: Credentials
}

async function CreateAccountHandler(
	req: CreateAccountRequest,
	res: NextApiResponse
) {
	const { body: userCredentials } = req

	const { guardian } = req.context

	// TODO: Validate the request input

	const userData = {
		...userCredentials,
		// This doesn't need to be a registrant (the API handles the registration)
		role: 'USER',
	}

	await guardian.account.register(userData)

	console.log('user registered')
	console.log(userData)

	const loginUser = await guardian.account.login(userCredentials)
	console.log('login user ok')

	// TODO: Replace with Hashgraph JS SDK call
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

	// The DID is missing from the initial login call so we call again to saturate the DID before returning the response
	const accountData = await guardian.account.login(userCredentials)

	Response.json(res, accountData)
}

export default CreateAccountHandler
