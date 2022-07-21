import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import useGuardianContext from '@app/context/useGuardianContext'
import registerProjectHandler from '@app/handler/policies/registerProjectHandler'

/**
 * @swagger
 * /api/policies/{id}/register:
 *   post:
 *     description: Allows submitting of a new ecological project to a policy
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Account created
 */
export default prepare(onlyPost, useGuardianContext)(registerProjectHandler)
