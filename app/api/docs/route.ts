import { type NextRequest, NextResponse } from "next/server"
import { swaggerSpec } from "@/lib/swagger"

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Retorna a especificação OpenAPI em JSON
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Especificação OpenAPI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(swaggerSpec)
}
