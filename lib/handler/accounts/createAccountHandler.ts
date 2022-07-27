import { GuardianMiddlewareRequest } from 'lib/context/useGuardianContext'
import { HashgraphMiddlewareRequest } from 'lib/context/useHashgraphContext'
import Response from 'lib/response'
import { NextApiResponse } from 'next'

type Credentials = {
	username: string
	password: string
}

type CreateAccountContext = GuardianMiddlewareRequest &
	HashgraphMiddlewareRequest
interface CreateAccountRequest extends CreateAccountContext {
	body: Credentials
}

async function CreateAccountHandler(
	req: CreateAccountRequest,
	res: NextApiResponse
) {
	const { body: userCredentials } = req

	const { guardian, hashgraphClient } = req.context

	// TODO: Validate the request input

	const userData = {
		...userCredentials,
		// This doesn't need to be a registrant (the API handles the registration)
		role: 'USER',
	}

	await guardian.account.register(userData)

	const loginUser = await guardian.account.login(userCredentials)

	const { accountId, privateKey } = await hashgraphClient.createAccount()

	const userProfile = {
		hederaAccountId: accountId,
		hederaAccountKey: privateKey,
	}

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
