import { Controller } from '@nestjs/common';
import { VacationService } from './vacation.service';

@Controller('vacation')
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}
}
