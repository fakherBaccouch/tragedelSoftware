//export packages :
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const cors = require('cors');
const fileUpload = require('express-fileupload');
var path = require('path');
// import routes
const userRoutes = require('./routes/user.routes');
const folderRoutes = require('./routes/folder.routes');
const fileRoutes = require('./routes/file.routes');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(cookieParser());
app.use(fileUpload());
// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user', userRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/file', fileRoutes);


// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})