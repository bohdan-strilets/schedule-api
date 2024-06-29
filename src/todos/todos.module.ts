import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CalendarModule } from 'src/calendar/calendar.module'
import { StatisticsModule } from 'src/statistics/statistics.module'
import { TodoModel } from './models/todo.model'
import { TodosController } from './todos.controller'
import { TodosService } from './todos.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TodoModel,
				schemaOptions: {
					collection: 'Todo',
				},
			},
		]),
		StatisticsModule,
		CalendarModule,
	],
	controllers: [TodosController],
	providers: [TodosService],
	exports: [TodosService],
})
export class TodosModule {}
