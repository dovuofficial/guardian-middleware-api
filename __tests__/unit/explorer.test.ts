import Explorer from 'src/utils/explorer'
import Config from 'src/config'

const placeholderTx = 'test'

describe('Explorer', () => {
	afterAll(() => {
		Config.network = process.env.HEDERA_NETWORK
	})

	it('Ensure that a default testnet explorer url returns', () => {
		Config.network = undefined

		const url = Explorer.getExplorerUrl(placeholderTx)

		expect(url).toBe(
			`https://ledger-testnet.hashlog.io/tx/${placeholderTx}`
		)
	})

	it('Ensure that a testnet explorer url returns', () => {
		Config.network = 'testnet'

		const url = Explorer.getExplorerUrl(placeholderTx)

		expect(url).toBe(
			`https://ledger-testnet.hashlog.io/tx/${placeholderTx}`
		)
	})

	it('Ensure that a mainnet explorer url returns', () => {
		Config.network = 'mainnet'

		const url = Explorer.getExplorerUrl(placeholderTx)

		expect(url).toBe(`https://ledger.hashlog.io/tx/${placeholderTx}`)
	})

	it('Ensure that a previewnet explorer url returns nothing', () => {
		Config.network = 'previewnet'

		const url = Explorer.getExplorerUrl(placeholderTx)

		expect(!url)
	})
})
