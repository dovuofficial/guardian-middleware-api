import { MRV } from 'src/config/guardianTags'
import validate from 'src/validators/validateMrvDocumentSubmission'

describe(`Validate Measurement Reporting Verification Document Submission`, () => {
	describe('General Supply Documentation', () => {
		it(`should return an error if the payload is not complete`, () => {
			const payload = {
				field0: 'field0',
				field1: 'field1',
				field2: 'field2',
				field3: '1000',
				field4: 'field4',
			}

			const result = validate('BAD_TYPE', payload)

			expect(result).toEqual([
				`The policy can only process MRV types of "${MRV.AGRECALC}", "${MRV.COOL_FARM_TOOL}" or "${MRV.GENERAL_SUPPLY_DOCUMENTATION}". Please update your request.`,
			])
		})
		it(`should return no errors if the payload is complete`, () => {
			const payload = {
				field0: 'field0',
				field1: 'field1',
				field2: 'field2',
				field3: '1000',
				field4: 'field4',
			}

			const result = validate(MRV.GENERAL_SUPPLY_DOCUMENTATION, payload)

			expect(result).toEqual(null)
		})
		it(`should return error if KGs are not divisible by 1000`, () => {
			const payload = {
				field0: 'field0',
				field1: 'field1',
				field2: 'field2',
				field3: '1500',
				field4: 'field4',
			}

			const result = validate(MRV.GENERAL_SUPPLY_DOCUMENTATION, payload)

			expect(result).toEqual([
				'Must be a string representing a positive integer divisible by 1,000',
			])
		})
		it(`should return error if KGs are a fraction`, () => {
			const payload = {
				field0: 'field0',
				field1: 'field1',
				field2: 'field2',
				field3: '1000.1000',
				field4: 'field4',
			}

			const result = validate(MRV.GENERAL_SUPPLY_DOCUMENTATION, payload)

			expect(result).toEqual([
				'Must be a string representing a positive integer divisible by 1,000',
			])
		})
		it(`should return error if KGs are empty`, () => {
			const payload = {
				field0: 'field0',
				field1: 'field1',
				field2: 'field2',
				field3: '',
				field4: 'field4',
			}

			const result = validate(MRV.GENERAL_SUPPLY_DOCUMENTATION, payload)

			expect(result).toEqual(['"field3" is not allowed to be empty'])
		})
	})
})
