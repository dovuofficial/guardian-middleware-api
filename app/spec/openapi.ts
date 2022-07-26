/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
	'/accounts': {
		post: {
			responses: {
				/** OK */
				200: {
					headers: {
						'Content-Type'?: string
					}
					content: {
						'application/json': components['schemas']['Account']
					}
				}
			}
			requestBody: {
				content: {
					'application/json': components['schemas']['Credentials']
				}
			}
		}
	}
	'/accounts/login': {
		post: {
			responses: {
				/** OK */
				200: {
					headers: {
						'Content-Type'?: string
					}
					content: {
						'application/json': components['schemas']['Account']
					}
				}
				/** Not Found */
				404: {
					headers: {
						'Content-Type'?: string
					}
					content: {
						'application/json': components['schemas']['Error']
					}
				}
			}
			requestBody: {
				content: {
					'application/json': components['schemas']['Credentials']
				}
			}
		}
	}
	'/policies/{policyId}/role': {
		post: {
			parameters: {
				path: {
					policyId: string
				}
			}
			responses: {
				/** OK */
				200: {
					headers: {
						Date?: string
						Connection?: string
						'Keep-Alive'?: string
						'Transfer-Encoding'?: string
					}
					content: {
						'text/plain': string
					}
				}
			}
			requestBody: {
				unknown
			}
		}
	}
	'/policies/{policyId}/register': {
		post: {
			parameters: {
				path: {
					policyId: string
				}
			}
			responses: {
				/** OK */
				200: {
					headers: {
						Date?: string
						Connection?: string
						'Keep-Alive'?: string
						'Transfer-Encoding'?: string
					}
					content: {
						'text/plain': string
					}
				}
			}
			requestBody: {
				content: {
					'application/json': { [key: string]: unknown }
				}
			}
		}
	}
}

export interface components {
	schemas: {
		/**
		 * @example {
		 *   "username": "justyn",
		 *   "password": "secret"
		 * }
		 */
		Credentials: {
			username: string
			password: string
		}
		/**
		 * @example {
		 *   "data": {
		 *     "username": "justyn",
		 *     "did": "did:hedera:testnet:Evkgr8TnmSHxNEWXoShEEcQmbyrMdQHN7oz6Y3ehXEDZ;hedera:testnet:tid=0.0.47741853",
		 *     "role": "USER",
		 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1c3R5bjExIiwiZGlkIjoiZGlkOmhlZGVyYTp0ZXN0bmV0OkV2a2dyOFRubVNIeE5FV1hvU2hFRWNRbWJ5ck1kUUhON296NlkzZWhYRURaO2hlZGVyYTp0ZXN0bmV0OnRpZD0wLjAuNDc3NDE4NTMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY1ODc2NDcyNX0.osyrOl7zq8UVnH9Xyvdxca5UrfuLT2OwBvDI3MPz4HA"
		 *   }
		 * }
		 */
		Account: {
			username?: string
			did?: string
			role?: string
			accessToken?: string
		}
		Error: {
			error?: {
				message?: string
				code?: number
				errors?: {
					message?: string
				}[]
			}
		}
	}
}

export interface operations {}

export interface external {}