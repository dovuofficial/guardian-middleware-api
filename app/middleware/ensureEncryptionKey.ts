import Language from '@app/constants/language'
import Response from '@app/response'
import Config from '@app/config'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const { noEncryptionKey } = Language.middleware.ensureEncryptionKey

const ENC_KEY_LEN = 32

function ensureEncryptionKey(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (Config.encryptionKey?.length === ENC_KEY_LEN) {
			return handler(req, res)
		}

		return Response.unprocessibleEntity(res, noEncryptionKey)
	}
}

export default ensureEncryptionKey
