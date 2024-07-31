const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');
const User = require('../models/User');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const JWT_SECRET = 'your_jwt_secret';
var nodemailer = require('nodemailer');
// ---------------------------------------------------------------------------------------------------------------------------------------
async function generateStructuredNotes(userPrompt) {
  const genAI = new GoogleGenerativeAI("AIzaSyCazJEmpYATyI34DZUKsHfwIoFq94yGALI");

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Given a user's message, convert it into a more structured form and divide it into sub-parts. Each sub-part should be created as a separate note with relevant tags and priority.
    
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
    always generate more than one notes for the usee message
    User message: ${userPrompt}
  `;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------------------






// var mailOptions = {
//   from: 'namitjainjob2111@gmail.com',
//   to: 'namitjain2111@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });




// -------------------------------------------------------------------------------------------------------------------------------------------
// Middleware to check for a valid token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).send('Token is not valid');
  }
};


// Get all notes for a user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add a new note
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Check for email addresses in the content
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const emailMatches = content.match(emailRegex);
    
    if (emailMatches) {
      const email = emailMatches[0];

      // Send email
      const mailOptions = {
        from: 'namitjainjob2111@gmail.com',
        to: email,
        subject: 'Meeting Request',
        text: 'You have a new meeting request!'
      };
      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'namitjainjob2111@gmail.com',
          pass: 'tzethlzweqpxhokr'
        }
      });
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      // Add a new note for the meeting
      const meetingNote = new Note({
        content: `Meet with ${email}`,
        tags: ['meet', 'email'],
        priority: 'High',
        user: req.user,
      });
      const savedNote = await meetingNote.save();
      
      return res.json([savedNote]);
    }

    // Generate structured notes if no email is found
    const generatedNotes = await generateStructuredNotes(content);

    // Save each generated note to the database
    const savedNotes = await Promise.all(generatedNotes.map(async (noteData) => {
      const newNote = new Note({
        content: noteData.content,
        tags: noteData.tags,
        priority: noteData.priority,
        user: req.user,
      });
      return await newNote.save();
    }));

    res.json(savedNotes);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    // Ensure user owns the note
    if (note.user.toString() !== req.user) {
      return res.status(401).send('User not authorized');
    }

    await note.deleteOne();
    res.json({ msg: 'Note removed' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
