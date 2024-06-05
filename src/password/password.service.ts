import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class PasswordService {
	private SALT = 10

	async checkPassword(newPassword: string, oldPassword: string) {
		return await compare(newPassword, oldPassword)
	}

	async createPassword(password: string) {
		return await hash(password, this.SALT)
	}
}
