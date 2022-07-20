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

const prepare =
	(...fns) =>
	(x) =>
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		fns.reverse().reduce((v, f) => f(v), x)

export default prepare
