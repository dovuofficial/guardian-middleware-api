import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { Tag } from 'src/config/guardianTags'

async function FetchTokenInformation(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId } = req.query
	const { guardian } = req.context

	const data = await guardian.policies.policyById(accessToken, String(policyId))

	const mintTokenPath = [
		Tag.verifierWorkflow,
		Tag.approveIssueRequestsPage,
		Tag.mintTokenParent,
		Tag.mintToken,
	]

	// 😅 I feel Justyn already wrote this...
	const traverseToBlock = (data, tagPath = []) => {
		const tag = tagPath.shift()

		if (tag) {
			const updated = data.children.find(child => child.tag === tag)

			return traverseToBlock(updated, tagPath)
		}

		return data
	}

	const block = traverseToBlock(data.config, mintTokenPath)

	Response.json(res, {
		policy_token_id: block.tokenId
	})
}

export default FetchTokenInformation
