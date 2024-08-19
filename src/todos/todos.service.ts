import {
	BadRequestException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CalendarService } from 'src/calendar/calendar.service'
import { ResponseType } from 'src/common/response.type'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { StatName } from 'src/statistics/enums/stat-name.enum'
import { TypeOperation } from 'src/statistics/enums/type-operation.enum'
import { StatisticsOperationsService } from 'src/statistics/statistics-operations.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateCompletedDto } from './dto/update-completed.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoModel } from './models/todo.model'

@Injectable()
export class TodosService {
	constructor(
		@InjectModel(TodoModel)
		private readonly TodoModel: ModelType<TodoModel>,
		private readonly statisticsOperations: StatisticsOperationsService,
		private readonly calendarService: CalendarService
	) {}

	async create(
		userId: string,
		dto: CreateTodoDto
	): Promise<ResponseType<TodoModel>> {
		this.checkDto(dto)
		const data = { ...dto, owner: userId }
		const day = await this.calendarService.getById(dto.day)
		const createdTodo = await this.TodoModel.create(data)
		const todoInfoForStat = this.statisticsOperations.getTodoInfo(createdTodo)

		await this.statisticsOperations.updateStat({
			date: day.data.date,
			userId,
			type: TypeOperation.INCREMENT,
			dto: todoInfoForStat,
			statName: StatName.TODO,
		})

		return {
			success: true,
			statusCode: HttpStatus.CREATED,
			data: createdTodo,
		}
	}

	async update(
		todoId: string,
		dto: UpdateTodoDto,
		userId: string
	): Promise<ResponseType<TodoModel>> {
		this.checkDto(dto)

		const todo = await this.checkTodoFromDb(todoId)
		const todoInfoForStat = this.statisticsOperations.getTodoInfo(todo)
		const day = await this.calendarService.getById(String(todo.day))

		if (todoInfoForStat.priority !== dto.priority) {
			await this.statisticsOperations.updateStat({
				date: day.data.date,
				userId,
				type: TypeOperation.DECREMENT,
				dto: todoInfoForStat,
				statName: StatName.TODO,
			})
			await this.statisticsOperations.updateStat({
				date: day.data.date,
				userId,
				type: TypeOperation.INCREMENT,
				dto: { priority: dto.priority },
				statName: StatName.TODO,
			})
		}

		const updatedTodo = await this.TodoModel.findByIdAndUpdate(todoId, dto, {
			new: true,
		})

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: updatedTodo,
		}
	}

	async updateCompleted(
		todoId: string,
		dto: UpdateCompletedDto,
		userId: string
	): Promise<ResponseType<TodoModel>> {
		this.checkDto(dto)

		const todo = await this.checkTodoFromDb(todoId)
		const day = await this.calendarService.getById(String(todo.day))

		if (dto.isCompleted) {
			await this.statisticsOperations.updateStat({
				date: day.data.date,
				userId,
				type: TypeOperation.INCREMENT,
				dto: { isCompleted: dto.isCompleted },
				statName: StatName.TODO,
			})
		} else {
			await this.statisticsOperations.updateStat({
				date: day.data.date,
				userId,
				type: TypeOperation.DECREMENT,
				dto: { isCompleted: dto.isCompleted },
				statName: StatName.TODO,
			})
		}

		const updatedTodo = await this.TodoModel.findByIdAndUpdate(
			todoId,
			{ ...dto },
			{ new: true }
		)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: updatedTodo,
		}
	}

	async delete(todoId: string, userId: string): Promise<ResponseType> {
		await this.checkTodoFromDb(todoId)
		const deletedTodo = await this.TodoModel.findByIdAndDelete(todoId)
		const day = await this.calendarService.getById(String(deletedTodo.day))
		const todoInfoForStat = this.statisticsOperations.getTodoInfo(deletedTodo)

		await this.statisticsOperations.updateStat({
			date: day.data.date,
			userId,
			type: TypeOperation.DECREMENT,
			dto: todoInfoForStat,
			statName: StatName.TODO,
		})

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async deleteAll(userId: string): Promise<ResponseType> {
		const allTodos = await this.TodoModel.find({ owner: userId })

		for (const todo of allTodos) {
			const response = await this.calendarService.getById(String(todo.day))
			const date = response.data.date
			const todoId = String(todo._id)
			const updatedDto = { isCompleted: false }

			if (todo.isCompleted) {
				const updatedTodo = await this.updateCompleted(
					todoId,
					updatedDto,
					userId
				)

				const infoForStat = this.statisticsOperations.getTodoInfo(
					updatedTodo.data
				)
				await this.statisticsOperations.updateStat({
					date,
					userId,
					type: TypeOperation.DECREMENT,
					dto: infoForStat,
					statName: StatName.TODO,
				})
			} else {
				const infoForStat = this.statisticsOperations.getTodoInfo(todo)
				await this.statisticsOperations.updateStat({
					date,
					userId,
					type: TypeOperation.DECREMENT,
					dto: infoForStat,
					statName: StatName.TODO,
				})
			}
		}

		await this.TodoModel.deleteMany({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async deleteByDay(dayId: string, userId: string): Promise<ResponseType> {
		const allTodosByDay = await this.TodoModel.find({
			day: dayId,
			owner: userId,
		})

		for (const todo of allTodosByDay) {
			const response = await this.calendarService.getById(String(todo.day))
			const date = response.data.date
			const todoId = String(todo._id)
			const updatedDto = { isCompleted: false }

			if (todo.isCompleted) {
				const updatedTodo = await this.updateCompleted(
					todoId,
					updatedDto,
					userId
				)

				const infoForStat = this.statisticsOperations.getTodoInfo(
					updatedTodo.data
				)
				await this.statisticsOperations.updateStat({
					date,
					userId,
					type: TypeOperation.DECREMENT,
					dto: infoForStat,
					statName: StatName.TODO,
				})
			} else {
				const infoForStat = this.statisticsOperations.getTodoInfo(todo)
				await this.statisticsOperations.updateStat({
					date,
					userId,
					type: TypeOperation.DECREMENT,
					dto: infoForStat,
					statName: StatName.TODO,
				})
			}
		}

		await this.TodoModel.deleteMany({ day: dayId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async getById(todoId: string): Promise<ResponseType<TodoModel>> {
		const todo = await this.checkTodoFromDb(todoId)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: todo,
		}
	}

	async getAll(userId: string): Promise<ResponseType<TodoModel[]>> {
		const todos = await this.TodoModel.find({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: todos,
		}
	}

	async getTodoByDay(
		dayId: string,
		userId: string
	): Promise<ResponseType<TodoModel[]>> {
		const todoFromDb = await this.TodoModel.findOne({ day: dayId })
		if (!todoFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		const todos = await this.TodoModel.find({ day: dayId, owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: todos,
		}
	}

	// HELPERS

	private async checkTodoFromDb(todoId: string) {
		const todoFromDb = await this.TodoModel.findById(todoId)
		if (!todoFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return todoFromDb
	}

	private checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}
}
