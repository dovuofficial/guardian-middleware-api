import StatusCode from '../../../src/constants/status'
import hmacAxios from '../../../src/apiClient/hmacApiClient'
import config from '../../../src/config'

const SECONDS = 1000
const TEN_SECONDS = 10 * SECONDS
const ONE_MINUTE = 60 * SECONDS

const loginResponseData = async (username, password) => {
	const data = { username, password }

	const response = await hmacAxios.post(
		`${config.apiUrl}/api/accounts/login`,
		data
	)

	return response.data.data
}

describe('Test Agrecalc policy flow', () => {
	const isoDate = new Date().toISOString()
	const registrant = `ci_registrant_${isoDate}`
	const verifier = `ci_verifier_${isoDate}`
	const password = 'secret'
	const policyId = config.testAgreCalcPolicyId
	const { registryUsername, registryPassword } = config

	it('should have the correct environment variables', () => {
		expect(config.apiUrl).toBeDefined()
		expect(config.testCoolFarmPolicyId).toBeDefined()
		expect(config.hmacAuthKey).toBeDefined()
		expect(config.hmacEnabled).toBeDefined()
		expect(config.network).toBeDefined()
		expect(config.registryUsername).toBeDefined()
		expect(config.registryPassword).toBeDefined()
		expect(config.guardianApiUrl).toBeDefined()
	})
	it(
		'creates a new registrant account',
		async () => {
			const data = { username: registrant, password }

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/accounts`,
				data
			)

			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'creates a new verifier account',
		async () => {
			const data = { username: verifier, password }

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/accounts`,
				data
			)

			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'assigns the policy REGISTRANT role to the registrant account',
		async () => {
			const { accessToken } = await loginResponseData(
				registrant,
				password
			)

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/role/registrant`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'assigns the policy VERIFIER role to the verifier account',
		async () => {
			const { accessToken } = await loginResponseData(verifier, password)

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/role/verifier`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'submits a new application',
		async () => {
			const { accessToken } = await loginResponseData(
				registrant,
				password
			)

			const data = {
				field0: `Matt Farm ${isoDate}`,
				field1: 'Paignton',
				field2: 420,
				field3: 'Fancy Soil',
				field4: 'A Cat',
				field5: 'We grow grass',
				field6: 'No we do not',
				field7: 'No, we do not...',
				field8: 'No',
			}

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/register`,
				data,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'approves the application',
		async () => {
			await new Promise((r) => setTimeout(r, TEN_SECONDS))
			const { did } = await loginResponseData(registrant, password)
			const { accessToken } = await loginResponseData(
				registryUsername,
				registryPassword
			)

			const response = await hmacAxios.put(
				`${config.apiUrl}/api/policies/${policyId}/approve/application/${did}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'submits an ecological project',
		async () => {
			await new Promise((r) => setTimeout(r, TEN_SECONDS))
			const { accessToken } = await loginResponseData(
				registrant,
				password
			)

			const data = {
				field0: '1234',
				field1: `Matt's Farm ${isoDate}`,
				field2: "This is a description about Matt's farm",
				field3: 'Matt Smithies',
				field4: 'Ecological Project Info - Link to Project Data',
				field5: 'Ecological Project Info - Country: The host country for the project',
				field6: 'Ecological Project Info - Project Scale: One from the list of - Micro, Small, Medium, or Large',
				field7: 'Modular Benefit Project - Unique identifier ',
				field8: 'Modular Benefit Project - Geographic Location',
				field9: 'Modular Benefit Project - Targeted Benefit Type',
				field10: 'Modular Benefit Project - Developer(s)',
				field11: 'Modular Benefit Project - Sponsor(s)',
				field12: 'Modular Benefit Project - Claim Tokens',
			}

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/project`,
				data,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'approves the ecological project',
		async () => {
			await new Promise((r) => setTimeout(r, TEN_SECONDS))
			const { did } = await loginResponseData(registrant, password)
			const { accessToken } = await loginResponseData(
				registryUsername,
				registryPassword
			)

			const response = await hmacAxios.put(
				`${config.apiUrl}/api/policies/${policyId}/approve/project/${did}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'submits an MRV request',
		async () => {
			await new Promise((r) => setTimeout(r, TEN_SECONDS))
			const { accessToken } = await loginResponseData(
				registrant,
				password
			)

			const data = {
				field0: 100,
				field1: 100,
				field2: 100,
				field3: 100,
				field4: 100,
				field5: 100,
			}

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/mrv/agrecalc`,
				data,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
	it(
		'approves the MRV request',
		async () => {
			await new Promise((r) => setTimeout(r, TEN_SECONDS))
			const { did } = await loginResponseData(registrant, password)
			const { accessToken } = await loginResponseData(verifier, password)

			const response = await hmacAxios.put(
				`${config.apiUrl}/api/policies/${policyId}/approve/mrv/${did}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			expect(response.status).toBe(StatusCode.OK)
		},
		ONE_MINUTE
	)
})
