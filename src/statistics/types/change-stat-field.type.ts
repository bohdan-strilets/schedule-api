import { TypeOperation } from '../enums/type-operation.enum'

export type ChangeStatField = {
	date: Date
	type: TypeOperation
	value: number
	userId: string
	fieldName: string
}
