import { NextResponse } from "next/server";
import { filterJournals } from "@/lib/filterJournals";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "scimago_2024_enriched.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, abstract, freeApcOnly, apiKey } = body;

    const fileContents = fs.readFileSync(dataPath, "utf8");
    const allJournals = JSON.parse(fileContents);
    const topJournals = filterJournals(allJournals, abstract, title, freeApcOnly, 1, 3);

    let resultsWithAI = topJournals.map((j: any) => ({
      journal: j,
      aiReasoning: `Top match based on keyword frequency in ${j.Categories?.split(';')[0] || 'your domain'}. (💡 Add your Gemini API Key in Settings to unlock real AI reasoning!)`
    }));

    if (apiKey && topJournals.length > 0) {
      try {
        const safeApiKey = apiKey.trim();
        
        // ==========================================
        // ADAPTASI LOGIKA PYTHON: Cari model otomatis
        // ==========================================
        let targetModel = "models/gemini-1.5-flash"; // Fallback awal
        
        try {
          const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${safeApiKey}`);
          if (listResponse.ok) {
            const listData = await listResponse.json();
            // Cari model pertama yang mendukung generateContent
            const validModel = listData.models?.find((m: any) => 
              m.supportedGenerationMethods?.includes("generateContent") && m.name.includes("gemini")
            );
            if (validModel) {
              targetModel = validModel.name; // Contoh output: "models/gemini-pro" atau "models/gemini-1.5-flash"
              console.log("Berhasil menemukan model:", targetModel);
            }
          }
        } catch (e) {
          console.log("Gagal melist model, menggunakan fallback...");
        }

        // ==========================================
        // EKSEKUSI PROMPT DENGAN MODEL YANG DITEMUKAN
        // ==========================================
       // ==========================================
        // EKSEKUSI PROMPT DENGAN MODEL YANG DITEMUKAN
        // ==========================================
        const prompt = `You are an expert academic advisor. 
        A researcher wants to publish a paper with this title: "${title}"
        And this abstract: "${abstract}"

        We have recommended these ${topJournals.length} Scopus indexed journals:
        ${topJournals.map((j: any, i: number) => `${i + 1}. ${j.Title} (Domain: ${j.Categories})`).join('\n')}

        For EACH journal, write ONE SPECIFIC, analytical sentence explaining exactly why this paper fits the journal's scope based on the abstract.
        You MUST return the output as a strict JSON array of strings. No markdown, no intro text.
        CRITICAL RULE: DO NOT use double quotes (") inside your sentences. If you need to quote words, use single quotes (') instead.
        Example: ["Reason for journal 1", "Reason for journal 2", "Reason for journal 3"]`;

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${safeApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1 }
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          let aiText = aiData.candidates[0].content.parts[0].text;
          
          aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          try {
            const reasoningArray = JSON.parse(aiText);
            resultsWithAI = topJournals.map((j: any, index: number) => ({
              journal: j,
              aiReasoning: reasoningArray[index] || `Strong match for your research abstract.`
            }));
          } catch (parseError) {
            console.error("Gagal membaca JSON dari Gemini:", aiText);
          }
        } else {
          console.error("Gemini API Error:", await aiResponse.text());
        }
      } catch (aiError) {
        console.error("AI Fetch Error:", aiError);
      }
    }

    return NextResponse.json(resultsWithAI);

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal pada server" }, { status: 500 });
  }
}