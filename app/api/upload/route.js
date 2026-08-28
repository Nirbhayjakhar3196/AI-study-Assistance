import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdfParser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdf");

    if (!pdfFile) {
      return NextResponse.json(
        { message: "Please upload a PDF." },
        { status: 400 }
      );
    }

    const extractedText = await extractPdfText(pdfFile);

    return NextResponse.json({
      message: "PDF parsed successfully!",
      characters: extractedText.length,
      preview: extractedText.slice(0, 300),
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to parse PDF.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}