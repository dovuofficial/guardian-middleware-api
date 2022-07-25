import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import CreateAccountHandler from '@app/handler/accounts/createAccountHandler'
import useGuardianContext from '@app/context/useGuardianContext'
import withHmac from '@app/middleware/withHmac'

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     description: Creates a new account
 *     produces:
 *       - application/json
 *     parameters:
 *       -
 *         name: username
 *         description: Username for the new user.
 *         type: string
 *         in: body
 *         required: true
 *       -
 *         name: password
 *         description: Password for the new user.
 *         type: string
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Account created
 */
export default prepare(
	onlyPost,
	withHmac,
	useGuardianContext
)(CreateAccountHandler)
