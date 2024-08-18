import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './errors/exceptions-filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.enableCors({ origin: process.env.CLIENT_URL, credentials: true })
	app.useGlobalFilters(new AllExceptionsFilter())
	app.useGlobalPipes(new ValidationPipe())
	app.setGlobalPrefix('api')
	await app.listen(process.env.PORT || 4000)
}
bootstrap()
