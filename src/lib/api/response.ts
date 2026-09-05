import { NextResponse } from "next/server";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function paginated<T>(data: T[], pagination: Pagination, status = 200) {
  return NextResponse.json({ success: true, data, pagination }, { status });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}
