const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = "mongodb+srv://ussalih:pappy@pappy.8lh3u.mongodb.net/?retryWrites=true&w=majority&appName=pappy";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database variable
let db;

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    // Set the database to use
    db = client.db('ussalih'); // The actual database name
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if the connection fails
  }
}

// Route to handle form submission
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'app')));

// Route to render index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Route to render form.html
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '/form.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const collection = db.collection('comments'); // Replace 'comments' with your desired collection name
    const result = await collection.insertOne({
      comment,
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'Data submitted successfully!', id: result.insertedId });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Start the server and connect to the database
const PORT = 3000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
