export type ResponseType<D = null> = {
	success: boolean
	statusCode: number
	message?: string
	data?: D | null
}
