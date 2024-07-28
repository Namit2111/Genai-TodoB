const { GoogleGenerativeAI } = require("@google/generative-ai");


async function generateStructuredNotes( userPrompt ) {
    // Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.api);

// Using `responseMimeType` requires one of the Gemini 1.5 Pro or 1.5 Flash models
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // Set the `responseMimeType` to output JSON
  generationConfig: { responseMimeType: "application/json" }
});

const prompt = `
  Given a user's message, convert it into a more structured form and divide it into sub-parts. Each sub-part should be created as a separate note with relevant tags and priority.
    always generate more than one notes
  Note Schema:
  {
    "type": "object",
    "properties": {
      "content": { "type": "string", "required": true },
      "tags": { "type": "array", "items": { "type": "string" }, "default": [] },
      "priority": { "type": "string", "default": "Normal or High" },
      "user": { "type": "string", "required": true },
      "date": { "type": "string", "format": "date-time", "default": "current date-time" }
    }
  }

  Example Input:
  "Plan for the day: 1. Finish the project report. 2. Attend the team meeting at 3 PM. 3. Review the new design mockups."

  Expected Output:
  [
    {
      "content": "Finish the project report",
      "tags": ["project", "report"],
      "priority": "High",
      "user": "user_id_here",
      "date": "current_date_here"
    },
    {
      "content": "Attend the team meeting at 3 PM",
      "tags": ["meeting", "team"],
      "priority": "Normal",
      "user": "user_id_here",
      "date": "current_date_here"
    },
    {
      "content": "Review the new design mockups",
      "tags": ["design", "review"],
      "priority": "Normal",
      "user": "user_id_here",
      "date": "current_date_here"
    }
  ]

  User message: ${userPrompt}
`;


  try {
    const result = await model.generateContent(prompt);
    const output = result.response.text();
    console.log(output);
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

// generateStructuredNotes();
