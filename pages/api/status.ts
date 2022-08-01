import config from 'src/config'
import Language from 'src/constants/language'
import { NextApiRequest, NextApiResponse } from 'next'

const { statusRequest } = Language

export interface StatusResponse {
	message: string
	environment_status: {
		hederaAccountId: boolean
		hederaPrivateKey: boolean
		hmacAuthKey: boolean
	}
	meta: { hint: string }
}

function ConnectionStatusHandler(
	_req: NextApiRequest,
	res: NextApiResponse<StatusResponse | 'ok'>
) {
	res.statusCode = 200

	if (config.hideStatus) {
		return res.send('ok')
	}

	return res.json({
		message: statusRequest.message,
		environment_status: {
			hederaAccountId: !!config.accountId,
			hederaPrivateKey: !!config.privateKey,
			hmacAuthKey: !!config.hmacAuthKey && config.hmacAuthKeyValid(),
		},
		meta: {
			hint: statusRequest.meta_hint,
		},
	})
}

export default ConnectionStatusHandler
