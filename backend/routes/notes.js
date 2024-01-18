// routes/notes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { Connection, Request, TYPES } = require('tedious');
const { encryptText, decryptText } = require('../utils/cryptoUtils'); // Assuming these are defined in a utils file
const connection = require('../db'); // Your configured tedious connection

// Helper function to execute SQL query
const executeSql = (sql, callback, params = []) => {
  const request = new Request(sql, (err, rowCount, rows) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, { rowCount, rows });
    }
  });

  // Add parameters to the SQL query if there are any
  params.forEach(param => {
    request.addParameter(param.name, param.type, param.value);
  });

  connection.execSql(request);
};

// Middleware to use for all requests to this router to authenticate the user
router.use(authenticate);

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, text } = req.body;
    const userId = req.user.id; // from the authenticate middleware

    // Encrypt the title and text
    const encryptedTitle = encryptText(title, process.env.ENCRYPTION_SECRET);
    const encryptedText = encryptText(text, process.env.ENCRYPTION_SECRET);

    // SQL query to insert a new note
    const insertNoteSql = `
      INSERT INTO Notes (Title, Text, UserId) 
      VALUES (@title, @text, @userId)
    `;

    executeSql(insertNoteSql, (err, result) => {
      if (err) return res.status(500).send('Server error');
      res.status(201).json({ message: 'Note created', noteId: result.rows[0].id }); // Adjust depending on how you get the new note's ID
    }, [
      { name: 'title', type: TYPES.NVarChar, value: encryptedTitle },
      { name: 'text', type: TYPES.NVarChar, value: encryptedText },
      { name: 'userId', type: TYPES.NVarChar, value: userId }
    ]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get all notes for the authenticated user
router.get('/', (req, res) => {
    const userId = req.user.id; // from the authenticate middleware
    const getNotesSql = `
      SELECT * FROM Notes
      WHERE UserId = @userId
    `;
  
    executeSql(getNotesSql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      // Assuming you have logic to parse rows into note objects
      const notes = result.rows.map(row => {
        return {
          id: row.id,
          title: decryptText(row.title, process.env.ENCRYPTION_SECRET),
          text: decryptText(row.text, process.env.ENCRYPTION_SECRET),
          // ... other fields ...
        };
      });
  
      res.json(notes);
    }, [
      { name: 'userId', type: TYPES.NVarChar, value: userId }
    ]);
  });
  // Get a single note by id
router.get('/:id', (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id; // from the authenticate middleware
    const getNoteSql = `
      SELECT * FROM Notes
      WHERE Id = @noteId AND UserId = @userId
    `;
  
    executeSql(getNoteSql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      const note = result.rows[0];
      note.title = decryptText(note.title, process.env.ENCRYPTION_SECRET);
      note.text = decryptText(note.text, process.env.ENCRYPTION_SECRET);
  
      res.json(note);
    }, [
      { name: 'noteId', type: TYPES.NVarChar, value: noteId },
      { name: 'userId', type: TYPES.NVarChar, value: userId }
    ]);
  });
// Update a note
router.put('/:id', (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id; // from the authenticate middleware
    const { title, text } = req.body;
  
    // Encrypt the updated content
    const encryptedTitle = encryptText(title, process.env.ENCRYPTION_SECRET);
    const encryptedText = encryptText(text, process.env.ENCRYPTION_SECRET);
  
    const updateNoteSql = `
      UPDATE Notes
      SET Title = @title, Text = @text
      WHERE Id = @noteId AND UserId = @userId
    `;
  
    executeSql(updateNoteSql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Note not found or user not authorized to update this note' });
      }
  
      res.json({ message: 'Note updated', noteId: noteId });
    }, [
      { name: 'title', type: TYPES.NVarChar, value: encryptedTitle },
      { name: 'text', type: TYPES.NVarChar, value: encryptedText },
      { name: 'noteId', type: TYPES.NVarChar, value: noteId },
      { name: 'userId', type: TYPES.NVarChar, value: userId }
    ]);
  });
// Delete a note
router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id; // from the authenticate middleware
    const deleteNoteSql = `
      DELETE FROM Notes
      WHERE Id = @noteId AND UserId = @userId
    `;
  
    executeSql(deleteNoteSql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Note not found or user not authorized to delete this note' });
      }
  
      res.json({ message: 'Note deleted' });
    }, [
      { name: 'noteId', type: TYPES.NVarChar, value: noteId },
      { name: 'userId', type: TYPES.NVarChar, value: userId }
    ]);
  });
      
module.exports = router;
