import { Types } from 'mongoose'
import { Gender } from '../enums/gender.enum'

export type ReturningUser = {
	_id: Types.ObjectId
	firstName: string
	lastName: string
	dateBirth: string
	email: string
	gender: Gender
	avatarUrls: string[]
	isActivated: boolean
	createdAt: Date
	updatedAt: Date
}
