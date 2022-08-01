import { GuardianMiddlewareRequest } from './useGuardianContext'
import { HashgraphMiddlewareRequest } from './useHashgraphContext'

export type CombinedContextRequest = GuardianMiddlewareRequest &
	HashgraphMiddlewareRequest
