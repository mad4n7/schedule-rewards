import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

type RouteHandler = (req: NextRequest, params: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error: any) {
      console.error('API Error:', error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            details: error.errors,
          },
          { status: 400 }
        );
      }

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code,
          },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
        },
        { status: 500 }
      );
    }
  };
}
