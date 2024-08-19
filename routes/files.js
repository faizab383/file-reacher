const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const { send } = require('process');

// Check if uploads directory exists, if not create it
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single('myfile');

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const file = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size
      });

      const response = await file.save();
      return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    } catch (error) {
      console.error('Error saving file to the database:', error);
      return res.status(500).json({ error: 'Failed to save file info to the database' });
    }
  });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required." });
  }

  try {
    // Get data from DB
    const file = await File.findOne({ uuid: uuid });

    if (!file) {
      return res.status(404).send({ error: "File not found." });
    }

    if (file.sender) {
      return res.status(422).send({ error: "Email already sent." });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    const sendMail = require('../services/emailservice');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text:`${emailFrom} shared a file with you`,
      html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + ' KB',
        expires: '24 hours'
      })
    });

    return res.send({ success: true });
  } catch (error) {
    console.error('Error processing send request:', error);
    return res.status(500).send({ error: 'Failed to process send request.' });
  }
});

module.exports = router;







// const router = require('express').Router();
// const multer = require('multer');
// const path = require('path');
// const File = require('../models/file');
// const {v4: uuid4} = require('uuid');

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'upload/'),
//     filename: (req, file, cb)=> {
//         const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     }
// })

// let upload = multer({
//     storage,
//     limit: {fileSize: 1000000*100},
// }).single('myfile');



// router.post('/', (req, res)=> {

   
//      upload(req, res,async (err) =>{
//         if(!req.file){
//             return res.json({error : 'all fields are required.'});
//        }
  
//         if(err){
//             return res.status(500).send({error: err.message})
//          }

//          const file= new File({
//             filename: req.file.filename,
//             uuid: uuid4(),
//             path: req.file.path,
//             size: req.file.size,
//          });

//          const response = await file.save();
//          return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

//      });



// });

// router.post('/send',async (req, res) =>{
   
//    const {uuid, emailTo, emailFrom} = req.body;
//    if(!uuid || !emailTo || !emailFrom){
//     return res.status(422).send({ error: 'All fields are required'});
//    }
   
//    const file = await File.findOne({ uuid: uuid});
//    if(file.sender){
//     return res.status(422).send({ error: 'Email already sent'});
//    }
//    file.sender = emailFrom;
//    file.receiver = emailTo;
//    const response = await file.save();

//    const sendMail = require('../services/emailservice');
//    sendMail({
//       from: emailFrom,
//       to: emailTo,
//       subject: 'reacher file sharing',
//       text: `${emailFrom} shared a file with you`,
//       html: require('../services/emailTemplate')({
//          emailFrom: emailFrom,
//          downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
//          size: parseInt(file.size/1000)+'KB',
//          expires: '24 hours'
//       })
//    });

// });

// module.exports = router;
