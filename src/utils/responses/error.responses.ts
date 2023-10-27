export const errorResponse = (message: string) => {
    return {
        status: 'error',
        message: message
    }
}