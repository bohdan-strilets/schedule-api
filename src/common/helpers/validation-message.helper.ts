class ValidationMessage {
	minTextLength(numberOfCharacters: number) {
		return `Minimum length ${numberOfCharacters} characters.`
	}

	maxTextLength(numberOfCharacters: number) {
		return `Maximum length ${numberOfCharacters} characters.`
	}
}

export const validationMessage = new ValidationMessage()
