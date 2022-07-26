import Explorer from '@lib/utils/explorer'
import Config from '@lib/config'

const placeholderTx = 'test'

test('Ensure that a default testnet explorer url returns', () => {
	Config.network = undefined

	const url = Explorer.getExplorerUrl(placeholderTx)

	expect(url).toBe(`https://ledger-testnet.hashlog.io/tx/${placeholderTx}`)
})

test('Ensure that a testnet explorer url returns', () => {
	Config.network = 'testnet'

	const url = Explorer.getExplorerUrl(placeholderTx)

	expect(url).toBe(`https://ledger-testnet.hashlog.io/tx/${placeholderTx}`)
})

test('Ensure that a mainnet explorer url returns', () => {
	Config.network = 'mainnet'

	const url = Explorer.getExplorerUrl(placeholderTx)

	expect(url).toBe(`https://ledger.hashlog.io/tx/${placeholderTx}`)
})

test('Ensure that a previewnet explorer url returns nothing', () => {
	Config.network = 'previewnet'

	const url = Explorer.getExplorerUrl(placeholderTx)

	expect(!url)
})
