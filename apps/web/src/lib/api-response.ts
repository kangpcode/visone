import { ForbiddenError } from "@visone/rbac";
import type {
  ApiErrorCode,
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  PaginationMeta,
} from "@visone/shared";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(
  data: T,
  options?: {
    status?: number;
    meta?: PaginationMeta;
    requestId?: string;
  }
) {
  const body: ApiSuccessEnvelope<T> = {
    success: true,
    data,
    ...(options?.meta ? { meta: options.meta } : {}),
    ...(options?.requestId ? { requestId: options.requestId } : {}),
  };
  return NextResponse.json(body, { status: options?.status ?? 200 });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  options?: {
    status?: number;
    details?: unknown;
    requestId?: string;
  }
) {
  const body: ApiErrorEnvelope = {
    success: false,
    error: {
      code,
      message,
      ...(options?.details !== undefined ? { details: options.details } : {}),
    },
    ...(options?.requestId ? { requestId: options.requestId } : {}),
  };
  return NextResponse.json(body, { status: options?.status ?? 400 });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError("VALIDATION_ERROR", "Input validation failed", {
      status: 422,
      details: error.flatten(),
    });
  }

  if (error instanceof ForbiddenError) {
    return apiError("FORBIDDEN", error.message, { status: 403 });
  }

  console.error("[API_ERROR]", error);
  return apiError("INTERNAL_ERROR", "An unexpected error occurred", {
    status: 500,
  });
}
