import config from 'src/config'
import Language from 'src/constants/language'
import { NextApiRequest, NextApiResponse } from 'next'

const { statusRequest } = Language

export interface StatusResponse {
	message: string
	environmentStatus: {
		hederaNetwork: string
		hederaAccountId: boolean
		hederaPrivateKey: boolean
		guardianApiUrl: boolean
		hmacEnabled: boolean
		hmacAuthKey: boolean
		registryUsername: boolean
		registryPassword: boolean
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
		environmentStatus: {
			hederaNetwork: config.network,
			hederaAccountId: !!config.accountId,
			hederaPrivateKey: !!config.privateKey,
			guardianApiUrl: !!config.guardianApiUrl,
			hmacEnabled: !!config.hmacEnabled,
			hmacAuthKey: !!config.hmacAuthKey && config.hmacAuthKeyValid(),
			registryUsername: !!config.registryUsername,
			registryPassword: !!config.registryPassword,
		},
		meta: {
			hint: statusRequest.meta_hint,
		},
	})
}

export default ConnectionStatusHandler
