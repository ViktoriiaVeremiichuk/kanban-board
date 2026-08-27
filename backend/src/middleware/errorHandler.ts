import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  next: NextFunction,
) => {
  console.error('ERROR:', err);

  const isProd = process.env.NODE_ENV === 'production';

  const error = err as { status?: number; message?: string };

  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : error.message,
  });
};
