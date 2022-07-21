import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import useGuardianContext from '@app/context/useGuardianContext'
import registerAccountToPolicyHandler from '@app/handler/policies/registerAccountToPolicyHandler'

/**
 * @swagger
 * /api/policies/{id}/role:
 *   post:
 *     description: Set the role of the account
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Account created
 */
export default prepare(
	onlyPost,
	useGuardianContext
)(registerAccountToPolicyHandler)
