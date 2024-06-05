import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { CompanyLogoUrl } from 'src/common/vars/company-logo'
import { DefaultAvatarUrl } from 'src/common/vars/default-avatar'
import { DefaultPosterUrl } from 'src/common/vars/default-poster'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { UserModel } from 'src/user/models/user.model'
import { UserService } from 'src/user/user.service'
import { v4 } from 'uuid'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegistrationDto } from './dto/registration.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
		private readonly sendgridService: SendgridService,
		private readonly userService: UserService
	) {}

	async registration(dto: RegistrationDto) {
		const { firstName, lastName, email, password } = dto
		const userFromDb = await this.userService.findByEmail(email)

		if (userFromDb)
			throw new ConflictException(
				'User with this email is already in the system'
			)

		const salt = await genSalt(10)
		const hashPassword = await hash(password, salt)
		const activationToken = v4()

		const createdUser = await this.UserModel.create({
			firstName,
			lastName,
			email,
			activationToken,
			password: hashPassword,
			avatarUrl: DefaultAvatarUrl,
			posterUrl: DefaultPosterUrl,
			company: { logoUrl: CompanyLogoUrl },
		})

		await this.sendgridService.sendConfirmEmailLetter(
			createdUser.email,
			createdUser.activationToken
		)

		const tokens = await this.createTokenPair(String(createdUser._id))

		return {
			user: this.userService.returnUserFields(createdUser),
			tokens,
		}
	}

	async login(dto: LoginDto) {
		const { email, password } = dto
		const user = await this.validateUser(email, password)
		const tokens = await this.createTokenPair(String(user._id))

		return {
			user: this.userService.returnUserFields(user),
			tokens,
		}
	}

	async refreshToken(dto: RefreshTokenDto) {
		const { refreshToken } = dto
		if (!refreshToken) throw new UnauthorizedException('Please sign in')

		const checkedToken = await this.jwtService.verifyAsync(refreshToken)

		if (!checkedToken)
			throw new UnauthorizedException('Invalid token or expired')

		const user = await this.userService.findById(checkedToken._id)
		const tokens = await this.createTokenPair(String(user._id))

		return {
			user: this.userService.returnUserFields(user),
			tokens,
		}
	}

	// HELPERS

	async createTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { refreshToken, accessToken }
	}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email)
		if (!user) throw new BadRequestException('Email is wrong')

		const isValidPassword = await compare(password, user.password)
		if (!isValidPassword) throw new BadRequestException('Password is wrong')

		if (!user.isActivated)
			throw new BadRequestException('Email is not activated')

		return user
	}
}
