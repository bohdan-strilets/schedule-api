import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Res,
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ResponseType } from 'src/common/response.type'
import { User } from 'src/user/decorators/user.decorator'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateCompletedDto } from './dto/update-completed.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoModel } from './models/todo.model'
import { TodosService } from './todos.service'

@Auth()
@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post('create')
	async create(
		@Body() dto: CreateTodoDto,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel>> {
		const data = await this.todosService.create(_id, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Patch('update/:todoId')
	async update(
		@Body() dto: UpdateTodoDto,
		@Param('todoId') todoId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel>> {
		const data = await this.todosService.update(todoId, dto, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Patch('update-completed/:todoId')
	async updateCompleted(
		@Body() dto: UpdateCompletedDto,
		@Param('todoId') todoId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel>> {
		const data = await this.todosService.updateCompleted(todoId, dto, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete/:todoId')
	async delete(
		@Param('todoId') todoId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.todosService.delete(todoId, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete-all')
	async deleteAll(
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.todosService.deleteAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete-by-day/:dayId')
	async deleteByDay(
		@Param('dayId') dayId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.todosService.deleteByDay(dayId, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('by-id/:todoId')
	async getById(
		@Param('todoId') todoId: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel>> {
		const data = await this.todosService.getById(todoId)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('all')
	async getAll(
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel[]>> {
		const data = await this.todosService.getAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('by-day/:dayId')
	async getTodoByDay(
		@Param('dayId') dayId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<TodoModel[]>> {
		const data = await this.todosService.getTodoByDay(dayId, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}
}
