import Config from 'app/config'
import Language from 'app/constants/language'
import { NextApiRequest, NextApiResponse } from 'next'

const { statusRequest } = Language

export type StatusResponse = {
	message: string
	environment_status: {
		hederaAccountId: boolean
		hederaPrivateKey: boolean
		authenticationKey: boolean
	}
	meta: { hint: string }
}

function ConnectionStatusHandler(
	_req: NextApiRequest,
	res: NextApiResponse<StatusResponse | 'ok'>
) {
	res.statusCode = 200

	if (!!Config.hideStatus) {
		return res.send('ok')
	}

	return res.json({
		message: statusRequest.message,
		environment_status: {
			hederaAccountId: !!Config.accountId,
			hederaPrivateKey: !!Config.privateKey,
			authenticationKey:
				!!Config.authenticationKey && Config.authenticationKeyValid(),
		},
		meta: {
			hint: statusRequest.meta_hint,
		},
	})
}

export default ConnectionStatusHandler
