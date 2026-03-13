export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = body.message;

    const schedeaseKnowledge = `
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

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are the official chatbot of Schedease. Only answer questions about Schedease. If unsure, say you do not know."
            },
            { role: "system", content: schedeaseKnowledge },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    if (!data.choices) {
      console.error(data);
      return res.status(500).json({ error: "OpenAI error" });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {

    console.error("Chatbot error:", error);

    res.status(500).json({
      error: "Chatbot failed",
      details: error.message
    });

  }
}