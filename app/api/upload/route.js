import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const pdf = formData.get("pdf");

    if (!pdf) {
      return NextResponse.json(
        { message: "No PDF uploaded." },
        { status: 400 }
      );
    }

    console.log("File Name:", pdf.name);
    console.log("File Size:", pdf.size);
    console.log("File Type:", pdf.type);

    return NextResponse.json({
      message: `${pdf.name} uploaded successfully.`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Upload failed." },
      { status: 500 }
    );
  }
}