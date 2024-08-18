import { Types } from 'mongoose'
import { Gender } from '../enums/gender.enum'
import { Location } from './location.type'

export type ReturningUser = {
	_id: Types.ObjectId
	firstName: string
	lastName: string
	nickname: string
	dateBirth: Date
	location: Location
	phoneNumber: string
	email: string
	gender: Gender
	description: string
	avatarUrl: string[]
	posterUrl: string[]
	isActivated: boolean
	createdAt: Date
	updatedAt: Date
}
