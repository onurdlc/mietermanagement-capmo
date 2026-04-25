import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      result: JSON.stringify({
        category: "Sanitary",
        trade: "Plumbing",
        severity: "HIGH",
        warranty_case: true,
        priority: "URGENT",
        next_questions: ["Seit wann tritt der Schaden auf?"],
        required_fields_missing: ["duration"],
        ready_for_ticket: false,
      }),
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.responses.create({
    model: "gpt-4o",
    input: `You are a senior construction manager. Analyze:\n${text}`,
  });

  return Response.json({ result: response.output_text });
}
