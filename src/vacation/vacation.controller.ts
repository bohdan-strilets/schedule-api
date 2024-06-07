import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { AddedVacationDto } from './dto/added-vacation.dto'
import { UseVacationDto } from './dto/use-vacation.dto'
import { VacationService } from './vacation.service'

@Auth()
@Controller('vacation')
export class VacationController {
	constructor(private readonly vacationService: VacationService) {}

	@Post('added')
	async added(@Body() dto: AddedVacationDto, @User('_id') _id: string) {
		return await this.vacationService.added(_id, dto)
	}

	@Patch('use-vacation/:vacationId')
	async useVacation(
		@Body() dto: UseVacationDto,
		@Param('vacationId') vacationId: string
	) {
		return await this.vacationService.useVacation(vacationId, dto)
	}
}