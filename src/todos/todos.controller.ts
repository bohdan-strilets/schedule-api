import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateCompletedDto } from './dto/update-completed.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodosService } from './todos.service'

@Auth()
@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post('create')
	async create(@Body() dto: CreateTodoDto, @User('_id') _id: string) {
		return await this.todosService.create(_id, dto)
	}

	@Patch('update/:todoId')
	async update(
		@Body() dto: UpdateTodoDto,
		@Param('todoId') todoId: string,
		@User('_id') _id: string
	) {
		return await this.todosService.update(todoId, dto, _id)
	}

	@Patch('update-completed/:todoId')
	async updateCompleted(
		@Body() dto: UpdateCompletedDto,
		@Param('todoId') todoId: string,
		@User('_id') _id: string
	) {
		return await this.todosService.updateCompleted(todoId, dto, _id)
	}

	@Delete('delete/:todoId')
	async delete(@Param('todoId') todoId: string, @User('_id') _id: string) {
		return await this.todosService.delete(todoId, _id)
	}

	@Delete('delete-all')
	async deleteAll(@User('_id') _id: string) {
		return await this.todosService.deleteAll(_id)
	}

	@Delete('delete-by-day/:dayId')
	async deleteByDay(@Param('dayId') dayId: string, @User('_id') _id: string) {
		return await this.todosService.deleteByDay(dayId, _id)
	}

	@Get('by-id/:todoId')
	async getById(@Param('todoId') todoId: string) {
		return await this.todosService.getById(todoId)
	}

	@Get('all')
	async getAll(@User('_id') _id: string) {
		return await this.todosService.getAll(_id)
	}

	@Get('by-day/:dayId')
	async getTodoByDay(@Param('dayId') dayId: string, @User('_id') _id: string) {
		return await this.todosService.getTodoByDay(dayId, _id)
	}
}
