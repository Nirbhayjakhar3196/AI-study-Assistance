import ai from "../../../lib/gemini";
import {NextResponse} from "next/server"

export async function POST(request){

    try {
        const body = await request.json();

        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: body.message,
        });

        const  encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller){

                for await(const chunk of response){
                    controller.enqueue(
                        encoder.encode(chunk.text)
                    )
                }

                controller.close();
            }
        })

        return new Response(stream ,    {
            headers : {
                "Content-Type" : "text/plain; charset=utf-8"
            }
        })

    } catch (error) {

        console.log("Gemini Error:" , error);

        return NextResponse.json({
            error: "Something went wrong with Gemini API."
        },{status : 500})
    }

}
