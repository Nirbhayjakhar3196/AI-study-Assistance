
const GEMINI_API_KEY= process.env.GEMINI_API_KEY;

export async function createEmbedding(text){

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${GEMINI_API_KEY}`,
        {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gemini-embedding-2",
                content:{
                    parts:[
                        {
                            text
                        }
                    ]
                }
            })
        }
    )

    const data = await response.json();

    return data.embedding.values

}