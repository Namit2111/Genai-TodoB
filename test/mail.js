var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'namitjainjob2111@gmail.com',
    pass: 'tzethlzweqpxhokr'
  }
});

var mailOptions = {
  from: 'namitjainjob2111@gmail.com',
  to: 'namitjain2111@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});