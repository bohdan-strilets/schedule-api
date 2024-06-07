import {
	IsOptional,
	IsPostalCode,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import {
	MAX_LOCATION_LENGTH,
	MIN_LOCATION_LENGTH,
} from 'src/common/vars/validation-rules'

export class ChangeAddressDto {
	@IsString()
	@IsOptional()
	@MinLength(MIN_LOCATION_LENGTH)
	@MaxLength(MAX_LOCATION_LENGTH)
	city?: string

	@IsString()
	@IsOptional()
	@MinLength(MIN_LOCATION_LENGTH)
	@MaxLength(MAX_LOCATION_LENGTH)
	country?: string

	@IsString()
	@IsPostalCode('PL')
	@IsOptional()
	postcode?: string
}
