import Environment from 'app/constants/environment'
import Config from 'app/config'

const ExplorerUrl = {
	[Environment.TESTNET]: 'https://ledger-testnet.hashlog.io/tx/',
	[Environment.PREVIEWNET]: null,
	[Environment.MAINNET]: 'https://ledger.hashlog.io/tx/',
}

function getExplorerUrl(tx: string): string {
	const network = Config.network || Environment.TESTNET

	if (network) {
		return `${ExplorerUrl[network]}${tx}`
	}
}

const explorer = {
	getExplorerUrl,
}

export default explorer