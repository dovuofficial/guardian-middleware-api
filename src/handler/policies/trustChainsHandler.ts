import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { Tag } from 'src/config/guardianTags'
import trustChainMapper from 'src/mappers/trustChainMapper'

async function TrustChainsHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { guardian } = req.context
	const { accessToken } = req

	// Fetch the id of the Verified Presentation UI block
	const verifiedPresentationBlockId = await guardian.policies.blockByTag(
		accessToken,
		policyId as string,
		Tag.verifiedPresentationGrid
	)

	// Fetch the Verified Presentation block data
	const verifiedPresentationBlock = await guardian.policies.blockById(
		accessToken,
		policyId as string,
		verifiedPresentationBlockId
	)

	// Extract the Trust Chain hash ids from the Verified Presentation block data
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

	const trustChainData = []

	// We require these to be sent sequentially as the server keeps the state of the filter between requests
	// eslint-disable-next-line no-restricted-syntax
	for (const trustChainHash of trustChainHashes) {
		// eslint-disable-next-line no-await-in-loop
		await guardian.policies.sendToBlock(
			accessToken,
			policyId as string,
			trustChainBlockId,
			{
				filterValue: trustChainHash,
			}
		)

		// eslint-disable-next-line no-await-in-loop
		const trustChainBlock = await guardian.policies.blockById(
			accessToken,
			policyId as string,
			trustChainBlockId
		)

		trustChainData.push(trustChainBlock.data)
	}

	// Map the trust chain data to a simplified flatter format
	const mappedResponse = trustChainMapper(trustChainData)

	Response.json(res, mappedResponse)
}

export default TrustChainsHandler
