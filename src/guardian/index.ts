import API from './api'
import account, { Accounts } from './account'
import demo, { Demo } from './demo'
import profile, { Profile } from './profile'
import schemas, { Schemas } from './schemas'
import tokens, { Tokens } from './tokens'
import policies, { Policies } from './policies'

export interface Guardian {
	account: Accounts
	demo: Demo
	profile: Profile
	schemas: Schemas
	tokens: Tokens
	policies: Policies
}

const guardian: Guardian = {
	account: account(API),
	demo: demo(API),
	profile: profile(API),
	schemas: schemas(API),
	tokens: tokens(API),
	policies: policies(API),
}

export default guardian
