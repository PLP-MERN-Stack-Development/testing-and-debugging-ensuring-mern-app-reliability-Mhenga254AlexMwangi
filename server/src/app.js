import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Posts API routes (for our existing integration tests)
app.get('/api/posts', (req, res) => {
  res.json({
    success: true,
    posts: [
      { id: 1, title: 'First Post', content: 'This is the first post' },
      { id: 2, title: 'Second Post', content: 'This is the second post' }
    ]
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }
  
  const newPost = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    post: newPost
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;