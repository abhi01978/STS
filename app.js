// //RIGHT CODE

// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [] }));

// const readDB = () => JSON.parse(fs.readFileSync(dbFile));
// const writeDB = (data) => fs.writeFileSync(dbFile, JSON.stringify(data));

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User already exists' });

//   const newUser = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser);
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser);
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { id: Date.now().toString(), userId, text, statusImage, statusVideo, createdAt: new Date().toISOString(), viewers: [] };
//   db.statuses.push(status);
//   writeDB(db);

//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Handle user disconnect
// io.on('connection', (socket) => {
//   socket.on('disconnect', () => {
//     const db = readDB();
//     db.users.forEach((user) => (user.isOnline = false));
//     writeDB(db);
//     io.emit('update-users', db.users); // Notify all clients
//   });
// });

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//     console.log('a user connected:', socket.id);

//     // Register the user with a unique identifier (e.g., user ID)
//     socket.on('register-user', (userId) => {
//         users[userId] = socket.id;
//         console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//     });

//     // Listen for messages sent from one user to another
//     socket.on('send-message', (message) => {
//         const receiverSocketId = users[message.receiverId];
//         if (receiverSocketId) {
//             // Emit the message to the receiver
//             io.to(receiverSocketId).emit('receive-message', message);
//         } else {
//             console.log('Receiver not found');
//         }
//     });

//     // Handle user disconnect
//     socket.on('disconnect', () => {
//         for (const userId in users) {
//             if (users[userId] === socket.id) {
//                 delete users[userId]; // Remove the user from the list
//                 break;
//             }
//         }
//     });
// });
// ///END CODE



// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User already exists' });

//   const newUser = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser);
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser);
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { id: Date.now().toString(), userId, text, statusImage, statusVideo, createdAt: new Date().toISOString(), viewers: [] };
//   db.statuses.push(status);
//   writeDB(db);

//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Get messages for a specific chat
// app.get('/messages/:userId1/:userId2', (req, res) => {
//   const { userId1, userId2 } = req.params;
//   const db = readDB();

//   if (!db.messages) db.messages = []; // Ensure messages array exists
//   const messages = db.messages.filter(
//     (msg) => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)
//   );
//   res.json(messages);
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('a user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// });

// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User already exists' });

//   const newUser = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser);
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser);
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { id: Date.now().toString(), userId, text, statusImage, statusVideo, createdAt: new Date().toISOString(), viewers: [] };
//   db.statuses.push(status);
//   writeDB(db);

//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Get messages for a specific chat
// app.get('/messages/:userId1/:userId2', (req, res) => {
//   const { userId1, userId2 } = req.params;
//   const db = readDB();

//   if (!db.messages) db.messages = []; // Ensure messages array exists
//   const messages = db.messages.filter(
//     (msg) => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)
//   );
//   res.json(messages);
// });

// // DELETE message
// app.delete('/delete-message/:messageId', (req, res) => {
//   const { messageId } = req.params;
//   const db = readDB();

//   if (!messageId) {
//     return res.status(400).json({ message: 'Message ID is required' });
//   }

//   const messageIndex = db.messages.findIndex((msg) => msg.id === messageId);

//   if (messageIndex === -1) {
//     return res.status(404).json({ message: 'Message not found' });
//   }

//   db.messages.splice(messageIndex, 1);
//   writeDB(db);

//   io.emit('message-deleted', { messageId });

//   res.json({ message: 'Message deleted successfully' });
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('a user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// }); 

// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User already exists' });

//   const newUser = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser);
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser);
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { id: Date.now().toString(), userId, text, statusImage, statusVideo, createdAt: new Date().toISOString(), viewers: [] };
//   db.statuses.push(status);
//   writeDB(db);

//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Get messages for a specific chat
// app.get('/messages/:userId1/:userId2', (req, res) => {
//   const { userId1, userId2 } = req.params;
//   const db = readDB();

//   if (!db.messages) db.messages = []; // Ensure messages array exists
//   const messages = db.messages.filter(
//     (msg) => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)
//   );
//   res.json(messages);
// });

// // DELETE message
// app.delete('/delete-message/:messageId', (req, res) => {
//   const { messageId } = req.params;
//   const db = readDB();

//   if (!messageId) {
//     return res.status(400).json({ message: 'Message ID is required' });
//   }

//   const messageIndex = db.messages.findIndex((msg) => msg.id === messageId);

//   if (messageIndex === -1) {
//     return res.status(404).json({ message: 'Message not found' });
//   }

//   db.messages.splice(messageIndex, 1);
//   writeDB(db);

//   io.emit('message-deleted', { messageId });

//   res.json({ message: 'Message deleted successfully' });
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('a user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// }); 


// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User  already exists' });

//   const newUser  = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser );
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser );
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User  ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { 
//     id: Date.now().toString(), 
//     userId, 
//     text, 
//     statusImage, 
//     statusVideo, 
//     createdAt: new Date().toISOString(), 
//     viewers: [] 
//   };
  
//   // Find the user who posted the status
//   const user = db.users.find(u => u.id === userId);
//   if (user) {
//     status.user = {
//       id: user.id,
//       username: user.username,
//       profileImage: user.profileImage,
//     };
//   } else {
//     console.error(`User  with ID ${userId} not found when posting status.`);
//   }

//   db.statuses.push(status);
//   writeDB(db);
  
//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Get messages for a specific chat
// app.get('/messages/:userId1/:userId2', (req, res) => {
//   const { userId1, userId2 } = req.params;
//   const db = readDB();

//   if (!db.messages) db.messages = []; // Ensure messages array exists
//   const messages = db.messages.filter(
//     (msg) => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)
//   );
//   res.json(messages);
// });

// // DELETE message
// app.delete('/delete-message/:messageId', (req, res) => {
//   const { messageId } = req.params;
//   const db = readDB();

//   if (!messageId) {
//     return res.status(400).json({ message: 'Message ID is required' });
//   }

//   const messageIndex = db.messages.findIndex((msg) => msg.id === messageId);

//   if (messageIndex === -1) {
//     return res.status(404).json({ message: 'Message not found' });
//   }

//   db.messages.splice(messageIndex, 1);
//   writeDB(db);

//   io.emit('message-deleted', { messageId });

//   res.json({ message: 'Message deleted successfully' });
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('a user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User  ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// });





// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User  already exists' });

//   const newUser  = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: true };
//   db.users.push(newUser );
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser );
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User  ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { 
//     id: Date.now().toString(), 
//     userId, 
//     text, 
//     statusImage, 
//     statusVideo, 
//     createdAt: new Date().toISOString(), 
//     viewers: [] 
//   };
  
//   // Find the user who posted the status
//   const user = db.users.find(u => u.id === userId);
//   if (user) {
//     status.user = {
//       id: user.id,
//       username: user.username,
//       profileImage: user.profileImage,
//     };
//   } else {
//     console.error(`User  with ID ${userId} not found when posting status.`);
//   }

//   db.statuses.push(status);
//   writeDB(db);
  
//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('a user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User  ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// });
// // Get messages between users
// app.get('/messages/:senderId/:receiverId', (req, res) => {
//   const { senderId, receiverId } = req.params;
//   const db = readDB();
//   const messages = db.messages.filter(m => (m.senderId === senderId && m.receiverId === receiverId) || (m.senderId === receiverId && m.receiverId === senderId));
//   res.json(messages);
// });


// // Delete message
// app.delete('/delete-message/:id', (req, res) => {
//   const { id } = req.params;
//   const db = readDB();
//   const initialLength = db.messages.length;
//   db.messages = db.messages.filter(message => message.id !== id);
//   writeDB(db);

//   if (db.messages.length < initialLength) {
//     res.json({ message: 'Message deleted successfully' });
//   } else {
//     res.status(404).json({ message: 'Message not found' });
//   }
// });


// // Delete message
// app.delete('/delete-message/:id', (req, res) => {
//   const { id } = req.params;
//   const db = readDB();
//   const initialLength = db.messages.length;
//   db.messages = db.messages.filter(message => message.id !== id);
//   writeDB(db);

//   if (db.messages.length < initialLength) {
//     res.json({ message: 'Message deleted successfully' });
//   } else {
//     res.status(404).json({ message: 'Message not found' });
//   }
// });

// const express = require('express');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // JSON database
// const dbFile = 'db.json';
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(dbFile));
//   } catch (error) {
//     console.error('Error reading database:', error);
//     return { users: [], statuses: [], messages: [] };
//   }
// };

// const writeDB = (data) => {
//   try {
//     fs.writeFileSync(dbFile, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error writing to database:', error);
//   }
// };

// // User registration
// app.post('/register', upload.single('profileImage'), async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//   const db = readDB();
//   const userExists = db.users.some((user) => user.username === username);
//   if (userExists) return res.status(400).json({ message: 'User  already exists' });

//   const newUser  = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: false, lastSeen: null };
//   db.users.push(newUser );
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.status(201).json(newUser );
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }

//   const db = readDB();
//   const user = db.users.find((user) => user.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   user.isOnline = true; // Set user online
//   user.lastSeen = null; // Reset last seen time
//   writeDB(db);

//   io.emit('update-users', db.users); // Notify all clients
//   res.json(user);
// });

// // Add status
// app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
//   const { userId, text } = req.body;

//   if (!userId || (!text && !req.files)) {
//     return res.status(400).json({ message: 'User  ID and at least one of text, image, or video are required' });
//   }

//   const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
//   const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

//   const db = readDB();
//   const status = { 
//     id: Date.now().toString(), 
//     userId, 
//     text, 
//     statusImage, 
//     statusVideo, 
//     createdAt: new Date().toISOString(), 
//     viewers: [] 
//   };
  
//   // Find the user who posted the status
//   const user = db.users.find(u => u.id === userId);
//   if (user) {
//     status.user = {
//       id: user.id,
//       username: user.username,
//       profileImage: user.profileImage,
//     };
//   } else {
//     console.error(`User  with ID ${userId} not found when posting status.`);
//   }

//   db.statuses.push(status);
//   writeDB(db);
  
//   io.emit('new-status', status); // Notify all connected clients
//   res.status(201).json(status);
// });

// // Get all users
// app.get('/users', (req, res) => {
//   const db = readDB();
//   res.json(db.users);
// });

// // Get all statuses
// app.get('/statuses', (req, res) => {
//   const db = readDB();
//   res.json(db.statuses);
// });

// // Serve frontend
// app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// // Start server
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Store user socket connections
// const users = {}; // Store the user's socket ID for routing messages

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Register the user with a unique identifier (e.g., user ID)
//   socket.on('register-user', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User  ${userId} registered with socket ID: ${socket.id}`);
//   });

//   // Listen for messages sent from one user to another
//   socket.on('send-message', (message) => {
//     const receiverSocketId = users[message.receiverId];
//     if (receiverSocketId) {
//       // Emit the message to the receiver
//       io.to(receiverSocketId).emit('receive-message', message);
//     } else {
//       console.log('Receiver not found');
//     }

//     // Save message to the database
//     const db = readDB();
//     if (!db.messages) db.messages = []; // Ensure messages array exists
//     db.messages.push(message);
//     writeDB(db);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         // Set user offline and update last seen time
//         const db = readDB();
//         const user = db.users.find(u => u.id === userId);
//         if (user) {
//           user.isOnline = false;
//           user.lastSeen = new Date().toISOString(); // Update last seen time
//           writeDB(db);
//           io.emit('update-users', db.users); // Notify all clients
//         }
//         delete users[userId]; // Remove the user from the list
//         break;
//       }
//     }
//   });
// });

// // Get messages between users
// app.get('/messages/:senderId/:receiverId', (req, res) => {
//   const { senderId, receiverId } = req.params;
//   const db = readDB();
//   const messages = db.messages.filter(m => (m.senderId === senderId && m.receiverId === receiverId) || (m.senderId === receiverId && m.receiverId === senderId));
//   res.json(messages);
// });

// // Delete message
// app.delete('/delete-message/:id', (req, res) => {
//   const { id } = req.params;
//   const db = readDB();
//   const initialLength = db.messages.length;
//   db.messages = db.messages.filter(message => message.id !== id);
//   writeDB(db);

//   if (db.messages.length < initialLength) {
//     res.json({ message: 'Message deleted successfully' });
//   } else {
//     res.status(404).json({ message: 'Message not found' });
//   }
// });



const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// JSON database
const dbFile = 'db.json';
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], statuses: [], messages: [] }));

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], statuses: [], messages: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

// User registration
app.post('/register', upload.single('profileImage'), async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  const db = readDB();
  const userExists = db.users.some((user) => user.username === username);
  if (userExists) return res.status(400).json({ message: 'User  already exists' });

  const newUser  = { id: Date.now().toString(), username, password: hashedPassword, profileImage, isOnline: false, lastSeen: null };
  db.users.push(newUser );
  writeDB(db);

  io.emit('update-users', db.users); // Notify all clients
  res.status(201).json(newUser );
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const db = readDB();
  const user = db.users.find((user) => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  user.isOnline = true; // Set user online
  user.lastSeen = null; // Reset last seen time
  writeDB(db);

  io.emit('update-users', db.users); // Notify all clients
  res.json(user);
});

// Add status
app.post('/status', upload.fields([{ name: 'statusImage' }, { name: 'statusVideo' }]), (req, res) => {
  const { userId, text } = req.body;

  if (!userId || (!text && !req.files)) {
    return res.status(400).json({ message: 'User  ID and at least one of text, image, or video are required' });
  }

  const statusImage = req.files?.statusImage ? `/uploads/${req.files.statusImage[0].filename}` : null;
  const statusVideo = req.files?.statusVideo ? `/uploads/${req.files.statusVideo[0].filename}` : null;

  const db = readDB();
  const status = { 
    id: Date.now().toString(), 
    userId, 
    text, 
    statusImage, 
    statusVideo, 
    createdAt: new Date().toISOString(), 
    viewers: [] 
  };
  
  // Find the user who posted the status
  const user = db.users.find(u => u.id === userId);
  if (user) {
    status.user = {
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
    };
  } else {
    console.error(`User  with ID ${userId} not found when posting status.`);
  }

  db.statuses.push(status);
  writeDB(db);
  
  io.emit('new-status', status); // Notify all connected clients
  res.status(201).json(status);
});

// Get all users
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Get all statuses
app.get('/statuses', (req, res) => {
  const db = readDB();
  res.json(db.statuses);
});

// Serve frontend
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Start server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Store user socket connections
const users = {}; // Store the user's socket ID for routing messages

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register the user with a unique identifier (e.g., user ID)
  socket.on('register-user', (userId) => {
    users[userId] = socket.id;
    console.log(`User  ${userId} registered with socket ID: ${socket.id}`);
  });

  // Listen for messages sent from one user to another
  socket.on('send-message', (message) => {
    const receiverSocketId = users[message.receiverId];
    if (receiverSocketId) {
      // Emit the message to the receiver
      io.to(receiverSocketId).emit('receive-message', message);
    } else {
      console.log('Receiver not found');
    }

    // Save message to the database
    const db = readDB();
    if (!db.messages) db.messages = []; // Ensure messages array exists
    db.messages.push(message);
    writeDB(db);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        // Set user offline and update last seen time
        const db = readDB();
        const user = db.users.find(u => u.id === userId);
        if (user) {
          user.isOnline = false;
          user.lastSeen = new Date().toISOString(); // Update last seen time
          writeDB(db);
          io.emit('update-users', db.users); // Notify all clients
        }
        delete users[userId]; // Remove the user from the list
        break;
      }
    }
  });
});

// Get messages between users
app.get('/messages/:senderId/:receiverId', (req, res) => {
  const { senderId, receiverId } = req.params;
  const db = readDB();
  const messages = db.messages.filter(m => (m.senderId === senderId && m.receiverId === receiverId) || (m.senderId === receiverId && m.receiverId === senderId));
  res.json(messages);
});

// Delete message
app.delete('/delete-message/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.messages.length;
  db.messages = db.messages.filter(message => message.id !== id);
  writeDB(db);

  if (db.messages.length < initialLength) {
    res.json({ message: 'Message deleted successfully' });
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});