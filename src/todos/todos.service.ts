import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoModel } from './models/todo.model'

@Injectable()
export class TodosService {
	constructor(
		@InjectModel(TodoModel)
		private readonly TodoModel: ModelType<TodoModel>
	) {}

	async create(userId: string, dto: CreateTodoDto) {
		this.checkDto(dto)
		const data = { ...dto, owner: userId }
		return await this.TodoModel.create(data)
	}

	async update(todoId: string, dto: UpdateTodoDto) {
		this.checkDto(dto)
		await this.checkTodoFromDb(todoId)

		return await this.TodoModel.findByIdAndUpdate(todoId, dto, {
			new: true,
		})
	}

	async delete(todoId: string) {
		await this.checkTodoFromDb(todoId)
		await this.TodoModel.findByIdAndDelete(todoId)
		return
	}

	async deleteAll(userId: string) {
		await this.TodoModel.deleteMany({ owner: userId })
		return
	}

	async getById(todoId: string) {
		return await this.checkTodoFromDb(todoId)
	}

	async getAll(userId: string) {
		return await this.TodoModel.find({ owner: userId })
	}

	// HELPERS

	async checkTodoFromDb(todoId: string) {
		const todoFromDb = await this.TodoModel.findById(todoId)
		if (!todoFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return todoFromDb
	}

	checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}
}
