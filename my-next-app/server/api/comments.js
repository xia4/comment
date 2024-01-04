// server/api/comment.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// CORS 설정
app.use(cors());

mongoose.connect('mongodb://localhost:27017/my-next-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for comments
const commentSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

// Create a Comment model based on the schema
const Comment = mongoose.model('Comment', commentSchema);

export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    const { comment } = req.body;

    try {
      // Create a new comment instance
      const newComment = new Comment({ content: comment });

      // Save the comment to the database
      await newComment.save();

      console.log('Comment saved to the database:', newComment);

      res.status(200).json({ status: 'success', message: 'Comment submitted successfully.' });
    } catch (error) {
      console.error('Error saving comment to the database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
