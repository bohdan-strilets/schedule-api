import { ReturningUser } from 'src/user/types/returning-user.type'
import { Tokens } from './tokens.type'

export type AuthResponse = {
	user: ReturningUser
	tokens: Tokens
}
