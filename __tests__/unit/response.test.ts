import Response from '@lib/response'
import { testApiHandler } from 'next-test-api-route-handler'

describe('Response', () => {
	it('responds with method not allowed', async () => {
		await testApiHandler<{ message: string }>({
			handler: (_, res) => Response.methodNotAllowed(res, 'GET'),
			test: async ({ fetch }) => {
				const res = await fetch()
				expect(res.status).toBe(405)
				const json = await res.json()
				expect(json.message).toBe(
					'Method GET is not allowed on this route'
				)
			},
		})
	})
	it('responds with unauthorised', async () => {
		const message = 'You are not authorised to access this resource'
		await testApiHandler<{ message: string }>({
			handler: (_, res) => Response.unauthorised(res, message),
			test: async ({ fetch }) => {
				const res = await fetch()
				expect(res.status).toBe(401)
				const json = await res.json()
				expect(json.message).toBe(message)
			},
		})
	})
	it('responds with unprocessible entity', async () => {
		const errors = { foo: 'bar' }
		await testApiHandler<{ errors: string | Array<string> }>({
			handler: (_, res) => Response.unprocessibleEntity(res, errors),
			test: async ({ fetch }) => {
				const res = await fetch()
				expect(res.status).toBe(422)
				const json = await res.json()
				expect(json.errors).toEqual(errors)
			},
		})
	})
	it('responds with bad request', async () => {
		await testApiHandler<null>({
			handler: (_, res) => Response.badRequest(res),
			test: async ({ fetch }) => {
				const res = await fetch()
				expect(res.status).toBe(400)
				const json = await res.json()
				expect(json).toEqual({})
			},
		})
	})
	it('responds with json', async () => {
		const data = { foo: 'bar' }
		await testApiHandler<{ data: Record<string, unknown> }>({
			handler: (_, res) => Response.json(res, data),
			test: async ({ fetch }) => {
				const res = await fetch()
				expect(res.status).toBe(200)
				const json = await res.json()
				expect(json.data).toEqual(data)
			},
		})
	})
})
