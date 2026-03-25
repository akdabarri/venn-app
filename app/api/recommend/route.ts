import { NextResponse } from "next/server";
import { filterJournals } from "@/lib/filterJournals";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "scimago_2024_enriched.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, abstract, freeApcOnly, apiKey, apiType = "gemini", modelPref = "fast" } = body;

    console.log(`--- Besbi API Gateway [${apiType} | ${modelPref}] ---`);

    // 1. Load Database & Manual Filter
    const fileContents = fs.readFileSync(dataPath, "utf8");
    const allJournals = JSON.parse(fileContents);
    const topJournals = filterJournals(allJournals, abstract, title, freeApcOnly, 1, 3);

    // Fallback awal jika AI gagal
    let resultsWithAI = topJournals.map((j: any) => ({
      journal: j,
      aiReasoning: `Analytical match based on Scopus metadata. (💡 AI reasoning limited/unavailable)`
    }));

    if (apiKey && topJournals.length > 0) {
      try {
        const safeApiKey = apiKey.trim();
        const prompt = `You are an expert academic advisor. 
        Researcher abstract: "${abstract}"
        Recommended journals: ${topJournals.map((j: any, i: number) => `${i + 1}. ${j.Title}`).join(', ')}
        Write ONE SPECIFIC analytical sentence for EACH journal explaining the fit. 
        Return ONLY a strict JSON array of strings: ["Reason 1", "Reason 2", "Reason 3"]
        Rule: Use DOUBLE QUOTES for the JSON structure. No intro/outro text.`;

        let aiResponse;

        // ==========================================
        // PROVIDER & MODEL SELECTION LOGIC
        // ==========================================
        if (apiType === "gemini") {
          // Gemini Discovery
          let targetModel = "gemini-1.5-flash"; 
          try {
            const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${safeApiKey}`);
            if (listRes.ok) {
              const listData = await listRes.json();
              const found = listData.models?.find((m: any) => 
                m.supportedGenerationMethods?.includes("generateContent") && 
                (m.name.includes("flash") || m.name.includes("pro"))
              );
              if (found) targetModel = found.name.split("/").pop();
            }
          } catch (e) { console.warn("Discovery failed."); }

          const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${safeApiKey}`;
          aiResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2 }
            })
          });
        } else {
          // LOGIKA UNTUK GROQ, OPENAI, & DEEPSEEK
          let baseUrl = "https://api.openai.com/v1/chat/completions";
          let modelName = "gpt-4o-mini";

          if (apiType === "groq") {
            baseUrl = "https://api.groq.com/openai/v1/chat/completions";
            // Switcher Groq: Smart (70B) vs Fast (8B)
            modelName = modelPref === "smart" ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
          } else if (apiType === "openai") {
            // Switcher OpenAI: Smart (GPT-4o) vs Fast (4o-mini)
            modelName = modelPref === "smart" ? "gpt-4o" : "gpt-4o-mini";
          } else if (apiType === "deepseek") {
            baseUrl = "https://api.deepseek.com/v1/chat/completions";
            modelName = "deepseek-chat";
          }

          aiResponse = await fetch(baseUrl, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${safeApiKey}`
            },
            body: JSON.stringify({
              model: modelName,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2
            })
          });
        }

        // ==========================================
        // RESPONSE HANDLING & BULLETPROOF PARSING
        // ==========================================
        if (aiResponse.status === 429) {
          return NextResponse.json(topJournals.map((j: any) => ({
            journal: j,
            aiReasoning: "⏳ AI is temporarily busy. Please wait 30s."
          })));
        }

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          let aiText = apiType === "gemini" 
            ? aiData.candidates?.[0]?.content?.parts?.[0]?.text || "" 
            : aiData.choices?.[0]?.message?.content || "";
          
          aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

          try {
            // Jalur 1: Standard JSON Parse
            const reasoningArray = JSON.parse(aiText);
            resultsWithAI = topJournals.map((j: any, index: number) => ({
              journal: j,
              aiReasoning: reasoningArray[index] || "Highly relevant match for your scope."
            }));
            console.log(`✅ AI [${apiType}] Success via Standard Parse`);
          } catch (parseError) {
            console.warn(`⚠️ Standard parse failed for ${apiType}, attempting Regex Recovery...`);
            
            // Jalur 2: Regex Recovery (Untuk handle tanda petik berantakan)
            const regex = /"(.*?)"|'(.*?)'/g;
            const matches: string[] = [];
            let match;
            
            while ((match = regex.exec(aiText)) !== null) {
              const content = match[1] || match[2];
              if (content && content.length > 5) {
                matches.push(content);
              }
            }

            if (matches.length >= topJournals.length) {
              resultsWithAI = topJournals.map((j: any, index: number) => ({
                journal: j,
                aiReasoning: matches[index]
              }));
              console.log(`✅ AI [${apiType}] Success via Regex Recovery`);
            } else {
              console.error("❌ Regex Recovery failed to find enough strings.");
            }
          }
        } else {
          console.error(`❌ API Error Status ${aiResponse.status}`);
        }
      } catch (err) {
        console.error("❌ AI Pipeline Error:", err);
      }
    }

    return NextResponse.json(resultsWithAI);

  } catch (error) {
    console.error("❌ Server Crash:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}