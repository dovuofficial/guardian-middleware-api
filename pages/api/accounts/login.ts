import prepare from '@app/utils/prepare'
import loginHandler from '@app/handler/accounts/loginHandler'
import useGuardianContext from '@app/context/useGuardianContext'
import onlyPost from '@app/middleware/onlyPost'

/**
 * @swagger
 * /api/accounts/login:
 *   post:
 *     description: Logs the user in and returns a temporary access token
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
export default prepare(onlyPost, useGuardianContext)(loginHandler)
