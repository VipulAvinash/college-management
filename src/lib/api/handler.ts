import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import { fail } from "./response";

type RouteContext = { params: Record<string, string> };

export function withErrorHandling<C extends RouteContext = RouteContext>(
  fn: (req: NextRequest, ctx: C) => Promise<Response>
) {
  return async (req: NextRequest, ctx: RouteContext) => {
    try {
      return await fn(req, ctx as C);
    } catch (err: any) {
      if (err?.digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
      if (err instanceof AppError) {
        return fail(err.code, err.message, err.statusCode, err.details);
      }
      if (err instanceof ZodError) {
        return fail(
          "VALIDATION_ERROR",
          "Invalid request data",
          422,
          err.flatten().fieldErrors
        );
      }
      // Never leak raw error/database details to the client.
      console.error("Unhandled API error:", err);
      return fail("INTERNAL_ERROR", "An unexpected error occurred", 500);
    }
  };
}
