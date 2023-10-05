const express = require('express');
const dotenv = require('dotenv');

const rejectNginx  = require('./rejectNginx.js');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.post('/api/rejectNginx', rejectNginx);

// Listen on PORT, and log a success message
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ...`);
});

