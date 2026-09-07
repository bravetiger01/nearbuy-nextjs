import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export const maxDuration = 60;

const PROMPT = `You are an expert at reading Indian GST purchase invoices / proforma invoices.
Extract every product / service LINE ITEM from this bill.

Return ONLY a valid JSON array — no markdown, no explanation — in this exact shape:
[
  {
    "name": "exact product name cleaned of serial numbers",
    "qty": 95,
    "rate": 135,
    "hsn": "33051090"
  }
]

Rules:
- "name"  → The product/service name exactly as written, stripped of leading Sr.No numbers.
- "qty"   → numeric quantity (integer or decimal).
- "rate"  → the UNIT PRICE / RATE column value (before tax), as a plain number.
- "hsn"   → HSN / SAC code if present, else "".
- SKIP header rows, totals, subtotals, tax rows (CGST/SGST/IGST), address lines, GSTIN lines, bank detail lines, and any other non-line-item content.
- If qty or rate is ambiguous, make your best guess.
- Output ONLY the JSON array. Any other text will cause a parse error.`;

// Models to try in order — first available wins
const MODELS = ['gemini-3.5-flash-lite', 'gemini-2.5-flash-image'];

export async function POST(req: NextRequest) {
  const key = process.env.GOOGLE_AI_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY_HERE') {
    return NextResponse.json(
      { error: 'GOOGLE_AI_KEY not set in .env.local — get a free key at aistudio.google.com/apikey' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 20 MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Normalise MIME type
    let mimeType = file.type || 'image/jpeg';
    if (mimeType === 'application/octet-stream') mimeType = 'image/jpeg';
    const supportedTypes = ['image/jpeg','image/png','image/webp','image/heic','image/heif','application/pdf'];
    if (!supportedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${mimeType}. Use JPG, PNG, WEBP, or PDF.` },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(key);

    let lastError: unknown;
    for (const modelName of MODELS) {
      try {
        console.log(`[scan-bill] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT,       threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,      threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        });

        const result = await model.generateContent([
          { inlineData: { data: base64, mimeType: mimeType as Parameters<typeof model.generateContent>[0][0]['inlineData']['mimeType'] } },
          PROMPT,
        ]);

        const text = result.response.text().trim();
        console.log(`[scan-bill] Raw response (first 300 chars):`, text.slice(0, 300));

        // Strip markdown code fences if Gemini added them
        const stripped = text
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```$/, '')
          .trim();

        const match = stripped.match(/\[[\s\S]*\]/);
        if (!match) {
          console.error('[scan-bill] No JSON array found in response:', text);
          return NextResponse.json({ error: 'Gemini did not return a JSON array', raw: text }, { status: 500 });
        }

        const items: { name: string; qty: number; rate: number; hsn: string }[] =
          JSON.parse(match[0]);

        console.log(`[scan-bill] ✓ Extracted ${items.length} items`);
        return NextResponse.json({ items });

      } catch (modelErr: unknown) {
        const msg = modelErr instanceof Error ? modelErr.message : String(modelErr);
        console.warn(`[scan-bill] Model ${modelName} failed:`, msg);
        lastError = modelErr;
        // Only retry on "model not found" / "not supported" errors
        if (!msg.includes('not found') && !msg.includes('not supported') && !msg.includes('404')) {
          throw modelErr; // Rethrow real errors (auth, quota, etc.)
        }
      }
    }

    throw lastError;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes('API_KEY') || message.includes('401') ? 401
      : message.includes('quota') || message.includes('429') ? 429
      : 500;
    console.error('[scan-bill] Final error:', message);
    return NextResponse.json({ error: message }, { status });
  }
}
