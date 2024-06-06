import { Injectable } from '@nestjs/common'
import { v2 } from 'cloudinary'
import { FileType } from './enums/file-type.enum'

@Injectable()
export class CloudinaryService {
	private cloudinary = v2

	constructor() {
		this.cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		})
	}

	async uploadFile(
		file: Express.Multer.File,
		type: FileType,
		path: string
	): Promise<string | null> {
		const uploadOptions = { folder: path, resource_type: type }
		const result = await this.cloudinary.uploader.upload(
			file.path,
			uploadOptions
		)
		if (result) return result.secure_url
		return null
	}

	getPublicId(url: string): string {
		const path = url.split('/')
		const filenameWithExtension = path.at(-1).split('.')
		const fileName = filenameWithExtension.slice(0, 1).join()
		const folders = path.slice(7, path.length - 1).join('/')
		const publicId = [folders, fileName].join('/')
		return publicId
	}
	async deleteFile(options: {
		filePath: string
		fileType: FileType
		folderPath: string
	}): Promise<void> {
		const deleteOptions = { resource_type: options.fileType, invalidate: true }
		const publicId = this.getPublicId(options.filePath)

		try {
			await this.cloudinary.uploader.destroy(publicId, deleteOptions)
		} catch (error) {
			throw new Error(`Deleting error: ${error}`)
		}

		try {
			await this.cloudinary.api.delete_folder(options.folderPath)
		} catch (error) {
			throw new Error(`Deleting error: ${error}`)
		}
	}

	isGoogleAvatarUrl(url: string): boolean {
		const googleAvatarPathRegex = /\/a\/[A-Za-z0-9_-]+=s\d{2,}-c/
		return googleAvatarPathRegex.test(url)
	}
}
