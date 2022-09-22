/*
 * Enable functions to be composed when checking middleware, validations and adding context
 *
 * e.g.
 * export default
 *   prepare(
 *     withAuthentication,
 *     withValidation,
 *     useHashgraphContext
 *   )(ExampleRouteHandler)
 *
 */

import exceptionFilter from 'src/middleware/exceptionFilter'

const generateMiddleware = (...fns) => [exceptionFilter, ...fns]

const prepare =
	(...fns) =>
	(x) =>
		generateMiddleware(...fns)
			.reverse()
			.reduce((v, f) => f(v), x)

export default prepare
