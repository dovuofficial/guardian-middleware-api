import Config from 'src/config'
import Validation from 'src/validators'

test('Ensure that the authentication key is valid', () => {
	const isValidKey = Validation.authToken(Config.hmacAuthKey)

	expect(isValidKey).toBe(true)
})

test('Ensure that a bad authentication key is invalid', () => {
	const isValidKey = Validation.authToken('1234')

	expect(isValidKey).toBe(false)
})

test('Ensure that a authentication key is at least 10 characters long', () => {
	expect(Config.hmacAuthKeyValid()).toBe(true)
})
