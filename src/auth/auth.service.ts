import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from 'src/user/models/user.model'
import { RegistrationDto } from './dto/registration.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async registration(dto: RegistrationDto) {
		const { firstName, lastName, email, password } = dto
		const userFromDb = await this.UserModel.findOne({ email })

		if (userFromDb)
			throw new ConflictException(
				'User with this email is already in the system'
			)

		const salt = await genSalt(10)
		const hashPassword = await hash(password, salt)

		const createdUser = await this.UserModel.create({
			firstName,
			lastName,
			email,
			password: hashPassword,
		})

		return {
			user: createdUser,
			tokens: { accT: '', refT: '' },
		}
	}
}
