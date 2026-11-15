import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  sortBy: z.string().trim().max(64).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  includeDeleted: z.coerce.boolean().default(false),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
  requestId?: string;
}

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

export const WEBHOOK_EVENTS = [
  "file.updated",
  "deploy.success",
  "deploy.failed",
  "template.published",
] as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];
