import Response from 'src/response'
import { NextApiResponse } from 'next'
import validateCredentials from 'src/validators/validateCredentials'
import { components } from 'src/spec/openapi'
import { CreateAccountDto } from 'src/guardian/account'
import { CombinedContextRequest } from 'src/context/useCombinedContext'

type Credentials = components['schemas']['Credentials']

interface CreateAccountRequest extends CombinedContextRequest {
	body: Credentials
}

async function CreateAccountHandler(
	req: CreateAccountRequest,
	res: NextApiResponse
): Promise<void> {
	const { body: userCredentials } = req

	const { guardian, hashgraphClient } = req.context

	const validationErrors = validateCredentials(userCredentials)

	if (validationErrors) {
		Response.unprocessibleEntity(validationErrors)
		return
	}

	const userData: CreateAccountDto = {
		...userCredentials,
		// This doesn't need to be a supplier (the API handles the registration)
		role: 'USER',
		password_confirmation: userCredentials.password,
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
