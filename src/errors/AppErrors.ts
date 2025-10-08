class AppError extends Error
{
    constructor(
        msg: string,
        public code: string = 'APP_ERROR',
        public status: number = 400,
        public details?: Record<string, unknown>,
        options?: { cause?: Error }
    ) {
        super(msg);
        this.name = 'AppError';
        if (options?.cause) {
            (this as any).cause = options.cause;
        }
    }
}

export { AppError }