export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = body.message;

    const schedeaseKnowledge = `
You are the official chatbot of Schedease.
Only answer questions about Schedease.
If unsure, say you do not know.

Schedease is a scheduling and appointment management platform.

Purpose:
Schedease helps users organise schedules and manage appointments efficiently.

Main Features:
- Appointment booking
- Calendar management
- Automated reminders
- Schedule tracking
- User-friendly dashboard

Target Users:
Students, professionals, and organisations.
`;

    const geminiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${schedeaseKnowledge}\n\nUser question: ${message}` }
              ]
            }
          ]
        })
      }
    );

    const text = await geminiResponse.text();
    console.log("Raw Gemini response:", text); // <--- DEBUG LOG

    const data = JSON.parse(text);

    if (!data.candidates) {
      return res.status(500).json({ error: "Gemini API error", details: data });
    }

    res.status(200).json({
      reply: data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Chatbot failed",
      details: error.message
    });
  }
}