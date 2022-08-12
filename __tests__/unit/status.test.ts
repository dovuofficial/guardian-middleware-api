import StatusCode from 'src/constants/status'

test('UNAUTHORIZED status code is 401', () => {
	expect(StatusCode.UNAUTHORIZED).toBe(401)
})

test('OK status code is 200', () => {
	expect(StatusCode.OK).toBe(200)
})

test('UNPROCESSIBLE_ENTITY status code is 422', () => {
	expect(StatusCode.UNPROCESSIBLE_ENTITY).toBe(422)
})

test('BAD_REQUEST status code is 400', () => {
	expect(StatusCode.BAD_REQUEST).toBe(400)
})

test('METHOD_NOT_ALLOWED status code is 405', () => {
	expect(StatusCode.METHOD_NOT_ALLOWED).toBe(405)
})
