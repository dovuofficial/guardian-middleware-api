import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import useGuardianContext from '@app/context/useGuardianContext'
import registerProjectHandler from '@app/handler/policies/registerProjectHandler'

/**
 * @swagger
 * /api/policies/{id}/register:
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
export default prepare(onlyPost, useGuardianContext)(registerProjectHandler)
