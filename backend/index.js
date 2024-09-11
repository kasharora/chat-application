const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

mongoose.connect('mongodb+srv://kashishkurra:Kashish2001@cluster0.jiwgbvt.mongodb.net/chat-app-main', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// New Message Schema
const MessageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

app.post('/register', async (req, res) => {
  const { name, mobileNumber, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      mobileNumber,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, 'secretKey', { expiresIn: '1h' });

    res.json({ token, name: user.name, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.get('/users', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Socket.io connection handler
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('register', (email) => {
    connectedUsers.set(email, socket.id);
    socket.email = email;
    console.log(`User registered: ${email} with socket ID: ${socket.id}`);
    console.log('Connected users:', Array.from(connectedUsers.entries()));
  });

  socket.on('chat message', async (msg) => {
    console.log('Received message:', msg);
    const { from, to, message } = msg;

    try {
      // Save message to database
      const newMessage = new Message({ from, to, message });
      await newMessage.save();
      console.log('Message saved to database');

      const targetSocketId = connectedUsers.get(to);
      console.log(`Target socket ID for ${to}: ${targetSocketId}`);

      if (targetSocketId) {
        // Send the message to the recipient
        io.to(targetSocketId).emit('chat message', { from, to, message });
        console.log(`Message sent to recipient ${to}`);
      } else {
        console.log(`Recipient ${to} is not connected`);
      }

      // Also send the message back to the sender
      socket.emit('chat message', { from, to, message });
      console.log(`Message sent back to sender ${from}`);
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', 'Failed to process message');
    }
  });

  socket.on('get messages', async ({ user1, user2 }) => {
    console.log(`Fetching messages between ${user1} and ${user2}`);
    try {
      const messages = await Message.find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 }
        ]
      }).sort('timestamp');
      socket.emit('previous messages', messages);
      console.log(`Sent ${messages.length} previous messages`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('error', 'Failed to fetch messages');
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUser = Array.from(connectedUsers.entries()).find(([email, id]) => id === socket.id);
    if (disconnectedUser) {
      const [email, _] = disconnectedUser;
      connectedUsers.delete(email);
      console.log(`User disconnected: ${email}`);
    } else {
      console.log('Unknown client disconnected');
    }
    console.log('Remaining connected users:', Array.from(connectedUsers.entries()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});