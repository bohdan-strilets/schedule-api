import { ShiftNumber } from 'src/calendar/enums/shift-number.enum'
import { Status } from 'src/calendar/enums/status.enum'
import { WorkStatFields } from '../enums/work-stat-fields.enum'
import { UpdateEntry } from '../types/update-entry.type'
import { WorkStatUpdates } from '../types/work-stat-updates.type'

export const getWorkStatUpdates = ({
	dayInfo,
	nightHours,
}: WorkStatUpdates): UpdateEntry[] => {
	const {
		grossEarning,
		isAdditional,
		netEarning,
		numberHours,
		shiftNumber,
		status,
	} = dayInfo
	const tax = grossEarning - netEarning

	return [
		{
			condition: status === Status.WORK,
			fields: [
				[WorkStatFields.NUMBER_WORK_DAYS, 1],
				[WorkStatFields.NUMBER_WORK_HOURS, numberHours],
				[WorkStatFields.TOTAL_DAYS, 1],
				[WorkStatFields.TOTAL_HOURS, numberHours],
				[WorkStatFields.GROSS_AMOUNT_MONEY_FOR_WORK_DAYS, grossEarning],
				[WorkStatFields.NET_AMOUNT_MONEY_FOR_WORK_DAYS, netEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_GROSS, grossEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_NET, netEarning],
				[WorkStatFields.TOTAL_TAX_PAID, tax],
			],
		},
		{
			condition: status === Status.WORK && isAdditional,
			fields: [
				[WorkStatFields.NUMBER_ADDITIONAL_WORK_DAYS, 1],
				[WorkStatFields.NUMBER_ADDITIONAL_WORK_HOURS, numberHours],
			],
		},
		{
			condition: status === Status.DAY_OFF,
			fields: [
				[WorkStatFields.NUMBER_DAYS_OFF, 1],
				[WorkStatFields.NUMBER_FREE_HOURS, numberHours],
			],
		},
		{
			condition: status === Status.VACATION,
			fields: [
				[WorkStatFields.NUMBER_VACATION_DAYS, 1],
				[WorkStatFields.NUMBER_VACATION_HOURS, numberHours],
				[WorkStatFields.TOTAL_DAYS, 1],
				[WorkStatFields.TOTAL_HOURS, numberHours],
				[WorkStatFields.GROSS_AMOUNT_MONEY_FOR_VACATION_DAYS, grossEarning],
				[WorkStatFields.NET_AMOUNT_MONEY_FOR_VACATION_DAYS, netEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_GROSS, grossEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_NET, netEarning],
				[WorkStatFields.TOTAL_TAX_PAID, tax],
			],
		},
		{
			condition: status === Status.SICK_LEAVE,
			fields: [
				[WorkStatFields.NUMBER_SICK_DAYS, 1],
				[WorkStatFields.NUMBER_SICK_HOURS, numberHours],
				[WorkStatFields.TOTAL_DAYS, 1],
				[WorkStatFields.TOTAL_HOURS, numberHours],
				[WorkStatFields.GROSS_AMOUNT_MONEY_FOR_SICK_DAYS, grossEarning],
				[WorkStatFields.NET_AMOUNT_MONEY_FOR_SICK_DAYS, netEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_GROSS, grossEarning],
				[WorkStatFields.TOTAL_MONEY_EARNED_NET, netEarning],
				[WorkStatFields.TOTAL_TAX_PAID, tax],
			],
		},
		{
			condition: status === Status.WORK && shiftNumber === ShiftNumber.SHIFT_1,
			fields: [[WorkStatFields.NUMBER_FIRST_SHIFTS, 1]],
		},
		{
			condition: status === Status.WORK && shiftNumber === ShiftNumber.SHIFT_2,
			fields: [[WorkStatFields.NUMBER_SECOND_SHIFT, 1]],
		},
		{
			condition:
				status === Status.WORK &&
				shiftNumber === ShiftNumber.SHIFT_2 &&
				nightHours > 0,
			fields: [[WorkStatFields.NUMBER_NIGHT_HOURS, nightHours]],
		},
	]
}
