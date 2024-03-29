import credentials from 'src/validators/validateCredentials'

describe('credentials', () => {
	it('should return an error if the username is not provided', () => {
		const userCredentials = {
			password: 'password',
		}

		// @ts-ignore
		const validationErrors = credentials(userCredentials)

		expect(validationErrors).toEqual(['"username" is required'])
	})
	it('should return an error if the password is not provided', () => {
		const userCredentials = {
			username: 'username',
		}

		// @ts-ignore
		const validationErrors = credentials(userCredentials)

		expect(validationErrors).toEqual(['"password" is required'])
	})
	it('should return no errors if the username and password are provided', () => {
		const userCredentials = {
			username: 'username',
			password: 'password',
		}

		const validationErrors = credentials(userCredentials)

		expect(validationErrors).toEqual(null)
	})
	it('should return a full set of errors for an empty input', () => {
		// @ts-ignore
		const validationErrors = credentials()

		expect(validationErrors).toEqual([
			'"username" is required',
			'"password" is required',
		])
	})
})
