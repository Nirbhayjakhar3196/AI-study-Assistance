import ai from "../../../lib/gemini";
import {NextResponse} from "next/server"

export async function POST(request){

    try {
        const body = await request.json();

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: body.message,
        });

        return NextResponse.json({
            reply : response.text
        })
    } catch (error) {

        console.log("Gemini Error:" , error);

        return NextResponse.json({
            error: "Something went wrong with Gemini API."
        },{status : 500})
    }

}
