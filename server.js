const express = require('express');
const app = express();
const connectDB = require('./config/db');
const filesRoute = require('./routes/files');
const upload = require('./routes/upload');
const path=require('path');
const cors = require('cors');
app.use(cors());


// Database connection
connectDB();
//template engines
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

// Middleware
app.use(express.json());//by default express dont know to take json data so explicitely we should tell.

// Routes
app.use('/api/files',require('./routes/files') );
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'))
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index', { title: 'Reacher-File Sharing Made Easy' });
  });

app.use('/',upload);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});







// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const helmet = require('helmet');
// require('dotenv').config();


// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Set view engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // Use Helmet to set various HTTP headers
// app.use(helmet());

// // Set CSP header using Helmet
// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: ["*"],
//         imgSrc: ["*"],
//         scriptSrc: ["*"],
//         styleSrc: ["*"]
//       }
//     })
//   );
  


// // Connect to MongoDB
// const connectDB = require('./config/db');
// connectDB();


// // Import routes
// app.use('/api/upload', require('./routes/files'));
// app.use('/files', require('./routes/show'));
// app.use('/files/download',require('./routes/download'));
// // Serve static files from the upload directory
// app.use('/upload', express.static(path.join(__dirname, 'upload')));

// // Serve the favicon.ico


// const PORT = process.env.PORT || 3000;
// app.use(express.static('public'));
// app.use(express.json());
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



// const path = require('path');
// const express = require("express");
// const app = express();



// const PORT = process.env.PORT || 3000;

// const connectDB = require('./config/db');
// connectDB();

// app.set('views', path.join(__dirname,'/views'));
// app.set('view engine', 'ejs');

// app.use(express.json());


// app.use("/api/files", require('./routes/files'));
// app.use(".files", require('./routes/show'));


// app.listen(PORT, ()=>{
//     console.log(`Listening on port ${PORT}`);
// })



// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config();

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Connect to MongoDB
// const connectDB = require('./config/db');
// connectDB();

// // Import routes
// const uploadRouter = require('./routes/files');
// app.use('/api/upload', uploadRouter);

// // Route to serve files by UUID
// app.get('/files/:uuid', async (req, res) => {
//     try {
//         const file = await File.findOne({ uuid: req.params.uuid });
//         if (!file) {
//             return res.status(404).json({ error: 'File not found' });
//         }
//         const filePath = path.join(__dirname, file.path);
//         res.download(filePath, file.filename);
//     } catch (err) {
//         return res.status(500).json({ error: 'Server error' });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
