import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { DefaultAvatarUrl } from 'src/common/vars/default-avatar'
import { DefaultPosterUrl } from 'src/common/vars/default-poster'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { PasswordService } from 'src/password/password.service'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { StatisticsService } from 'src/statistics/statistics.service'
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
		private readonly userService: UserService,
		private readonly passwordService: PasswordService,
		private readonly statisticsService: StatisticsService
	) {}

	async registration(dto: RegistrationDto) {
		const { firstName, lastName, email, password } = dto
		const userFromDb = await this.userService.findByEmail(email)

		if (userFromDb) throw new ConflictException(ErrorMessages.EMAIL_IN_USE)

		const hashPassword = await this.passwordService.createPassword(password)
		const activationToken = v4()

		const createdUser = await this.UserModel.create({
			firstName,
			lastName,
			email,
			activationToken,
			password: hashPassword,
			avatarUrls: [DefaultAvatarUrl],
			posterUrls: [DefaultPosterUrl],
		})

		await this.statisticsService.createStatistics(String(createdUser._id))
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
		if (!refreshToken)
			throw new UnauthorizedException(ErrorMessages.USER_IS_NOT_UNAUTHORIZED)

		const checkedToken = await this.jwtService.verifyAsync(refreshToken)
		if (!checkedToken)
			throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN)

		const userFromDb = await this.userService.findById(checkedToken._id)
		if (!userFromDb) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		const tokens = await this.createTokenPair(String(userFromDb._id))

		return {
			user: this.userService.returnUserFields(userFromDb),
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
		if (!user) throw new BadRequestException(ErrorMessages.EMAIL_IS_WRONG)

		const isValidPassword = await this.passwordService.checkPassword(
			password,
			user.password
		)

		if (!isValidPassword)
			throw new BadRequestException(ErrorMessages.PASSWORD_IS_WRONG)

		if (!user.isActivated)
			throw new BadRequestException(ErrorMessages.EMAIL_IS_NOT_ACTIVATED)

		return user
	}
}
