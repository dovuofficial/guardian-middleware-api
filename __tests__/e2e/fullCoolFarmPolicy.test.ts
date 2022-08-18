import StatusCode from 'src/constants/status'
import hmacAxios from 'src/apiClient/hmacApiClient'
import config from 'src/config'

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

describe('Test Cool Farm policy flow', () => {
	const isoDate = new Date().toISOString()
	const registrant = `ci_registrant_${isoDate}`
	const verifier = `ci_verifier_${isoDate}`
	const password = 'secret'
	const policyId = config.testCoolFarmPolicyId
	const { registryUsername, registryPassword } = config

	it.only('should have the correct environment variables', () => {
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
				field0: `Project ${isoDate}`,
				field1: 'Project Location',
				field2: 57779,
				field3: 'Illum commodi quidem dolorem voluptatibus.',
				field4: 'Porro qui error earum quia iure praesentium molestiae.',
				field5: 'Aut necessitatibus voluptatem quae nemo reiciendis officia et aperiam quia.',
				field6: 'Quia maiores vel et reprehenderit eius fugiat quae nihil.',
				field7: 'Aliquid et sint sint assumenda nostrum eum.',
				field8: 'Quia explicabo dolorum minima perspiciatis suscipit odit explicabo aut amet.',
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
				field0: 'uuid13',
				field1: `Project ${isoDate}`,
				field2: 'Project description',
				field3: registrant,
				field4: {
					field0: 'dovu.market',
					field1: 'England',
					field2: 'Micro',
				},
				field5: {
					field0: 'uuid',
					field1: 'GeoJSON Location',
					field2: 'Removal',
					field3: 'N/A',
					field4: 'N/A',
					field5: 'N/A',
					field6: 1,
					field7: 'N/A',
					field8: 'Developer of project',
					field9: 'Sponsor (optional)',
					field10: 'Claim Tokens (number)',
				},
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
				field0: `Test MRV Field 1 ${isoDate}`,
				field1: 100,
				field2: 'Test MRV Field 3',
				field3: 200,
				field4: 300,
			}

			const response = await hmacAxios.post(
				`${config.apiUrl}/api/policies/${policyId}/mrv/cool-farm-tool`,
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
