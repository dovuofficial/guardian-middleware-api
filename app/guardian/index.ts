import API from './api'
import Account from './account'
import Demo from './demo'
import Profile from './profile'
import Schemas from './schemas'
import Tokens from './tokens'
import Policies from './policies'

const guardian = {
	account: Account(API),
	demo: Demo(API),
	profile: Profile(API),
	schemas: Schemas(API),
	tokens: Tokens(API),
	policies: Policies(API),
}

export default guardian
