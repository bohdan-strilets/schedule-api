import { Injectable } from '@nestjs/common'
import * as sendgrid from '@sendgrid/mail'
import * as fs from 'fs'
import * as handlebars from 'handlebars'
import { join } from 'path'
import { EmailType } from './types/email.type'
import { HbsTemplate } from './types/hbs-template.type'

@Injectable()
export class SendgridService {
	private readonly rootPath = join(
		__dirname,
		'..',
		'..',
		'src',
		'sendgrid',
		'templates'
	)

	constructor() {
		sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
	}

	private renderTemplate(
		templatePath: string,
		variables?: HbsTemplate
	): string {
		const templateSource = fs.readFileSync(templatePath, 'utf8')
		const template = handlebars.compile(templateSource)
		return template(variables)
	}

	private async sendEmail(data: EmailType) {
		const email = { ...data, from: process.env.SENDGRID_OWNER }
		await sendgrid.send(email)
		return
	}

	async sendConfirmEmailLetter(
		email: string,
		activationToken: string
	): Promise<void> {
		const templatePath = join(this.rootPath, 'activation-email.template.hbs')
		const variables = { API_URL: process.env.API_URL, activationToken }
		const htmlContent = this.renderTemplate(templatePath, variables)

		const mail = {
			to: email,
			subject: 'Welcome! Activate Your Account.',
			html: htmlContent,
		}

		await this.sendEmail(mail)
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		const templatePath = join(this.rootPath, 'reset-password.template.hbs')
		const variables = { CLIENT_URL: process.env.CLIENT_URL }
		const htmlContent = this.renderTemplate(templatePath, variables)

		const mail = {
			to: email,
			subject: 'Password Reset Instructions.',
			html: htmlContent,
		}

		await this.sendEmail(mail)
	}
}
