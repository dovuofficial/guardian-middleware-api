import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { Tag } from 'src/config/guardianTags'
import config from 'src/config'
import trustChainMapper from 'src/mappers/trustChainMapper'

async function TrustChainsHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { guardian } = req.context

	// 😅 Impersonate the Standard registry to get data from a given block
	const { accessToken } = await guardian.account.login({
		username: config.registryUsername,
		password: config.registryPassword,
	})

	const verifiedPresentationBlockId = await guardian.policies.blockByTag(
		accessToken,
		policyId as string,
		Tag.verifiedPresentationGrid
	)

	const verifiedPresentationBlock = await guardian.policies.blockById(
		accessToken,
		policyId as string,
		verifiedPresentationBlockId
	)

	const trustChainHashes = verifiedPresentationBlock.data.reduce(
		(acc, block) => {
			acc.push(block.hash)
			return acc
		},
		[] as string[]
	)

	// Fetch the trust chain block uuid
	const trustChainBlockId = await guardian.policies.blockByTag(
		accessToken,
		policyId as string,
		Tag.trustChainBlock
	)

	// iterate over the trust chain hashes and fetch the blocks

	const trustChainData = await Promise.all(
		trustChainHashes.map(async (trustChainHash) => {
			await guardian.policies.sendToBlock(
				accessToken,
				policyId as string,
				trustChainBlockId,
				{
					filterValue: trustChainHash,
				}
			)
			const trustChainBlock = await guardian.policies.blockById(
				accessToken,
				policyId as string,
				trustChainBlockId
			)

			return trustChainBlock.data
		})
	)

	const mappedResponse = trustChainMapper(trustChainData)

	Response.json(res, mappedResponse)
}

export default TrustChainsHandler
