import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "VISONE Platform API",
    version: "1.0.0",
    description:
      "REST API v1 for VISONE (Design. Share. Deploy. — All in one). Endpoints are expanded progressively per phase.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Current Environment",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["System"],
        responses: {
          "200": {
            description: "Service health status",
          },
        },
      },
    },
    "/openapi": {
      get: {
        summary: "OpenAPI 3.1 specification document",
        tags: ["System"],
        responses: {
          "200": {
            description: "OpenAPI JSON",
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}
