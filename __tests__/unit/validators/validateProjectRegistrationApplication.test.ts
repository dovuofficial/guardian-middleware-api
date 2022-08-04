import validate from 'src/validators/validateProjectRegistrationApplication'

describe('Validate Ecological Project Application', () => {
	it('should return an error if the payload is not complete', () => {
		const payload = {
			field0: 'Blanditiis consequuntur repellat voluptatem quod et aperiam voluptas.',
		}

		// @ts-ignore
		const validationErrors = validate(payload)

		expect(validationErrors).toEqual([
			'"field1" is required',
			'"field2" is required',
			'"field3" is required',
			'"field4" is required',
			'"field5" is required',
			'"field6" is required',
			'"field7" is required',
			'"field8" is required',
		])
	})
	it('should return no errors if the payload is complete', () => {
		const payload = {
			field0: 'Blanditiis consequuntur repellat voluptatem quod et aperiam voluptas.',
			field1: 'A at mollitia corporis molestiae ut debitis.',
			field2: 57779,
			field3: 'Illum commodi quidem dolorem voluptatibus.',
			field4: 'Porro qui error earum quia iure praesentium molestiae.',
			field5: 'Aut necessitatibus voluptatem quae nemo reiciendis officia et aperiam quia.',
			field6: 'Quia maiores vel et reprehenderit eius fugiat quae nihil.',
			field7: 'Aliquid et sint sint assumenda nostrum eum.',
			field8: 'Quia explicabo dolorum minima perspiciatis suscipit odit explicabo aut amet.',
		}

		const validationErrors = validate(payload)

		expect(validationErrors).toEqual(null)
	})
	it('should return errors for an unknown field', () => {
		const payload = {
			field0: 'Blanditiis consequuntur repellat voluptatem quod et aperiam voluptas.',
			field1: 'A at mollitia corporis molestiae ut debitis.',
			field2: 57779,
			field3: 'Illum commodi quidem dolorem voluptatibus.',
			field4: 'Porro qui error earum quia iure praesentium molestiae.',
			field5: 'Aut necessitatibus voluptatem quae nemo reiciendis officia et aperiam quia.',
			field6: 'Quia maiores vel et reprehenderit eius fugiat quae nihil.',
			field7: 'Aliquid et sint sint assumenda nostrum eum.',
			field8: 'Quia explicabo dolorum minima perspiciatis suscipit odit explicabo aut amet.',
			badField: 'This is a bad field',
		}

		const validationErrors = validate(payload)

		expect(validationErrors).toEqual(['"badField" is not allowed'])
	})
	it('should return errors for bad types', () => {
		const payload = {
			field0: 42,
			field1: 24.4,
			field2: 'String value',
			field3: 'Illum commodi quidem dolorem voluptatibus.',
			field4: 'Porro qui error earum quia iure praesentium molestiae.',
			field5: 'Aut necessitatibus voluptatem quae nemo reiciendis officia et aperiam quia.',
			field6: 'Quia maiores vel et reprehenderit eius fugiat quae nihil.',
			field7: 'Aliquid et sint sint assumenda nostrum eum.',
			field8: 'Quia explicabo dolorum minima perspiciatis suscipit odit explicabo aut amet.',
		}

		// @ts-ignore
		const validationErrors = validate(payload)

		expect(validationErrors).toEqual([
			'"field0" must be a string',
			'"field1" must be a string',
			'"field2" must be a number',
		])
	})
	it('should return a full set of errors for an empty input', () => {
		// @ts-ignore
		const validationErrors = validate()

		expect(validationErrors).toEqual([
			'"field0" is required',
			'"field1" is required',
			'"field2" is required',
			'"field3" is required',
			'"field4" is required',
			'"field5" is required',
			'"field6" is required',
			'"field7" is required',
			'"field8" is required',
		])
	})
})
