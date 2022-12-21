const nodemailer = require('nodemailer');

module.exports.sendEmail = (name, email) => {
  const mail = `
      <div style="background: #333;">
      <div style="padding: 10px; max-width: 500px">
      <h3 style="color: #fff">Welcome to Yelpcamp!</h3>
      <h4 style="color: #fff">Hi ${name}</h4>
      <p style="color: #fff; line-height: 20px">Thank you for choosing Yelpcamp, now you can easily find campgrounds with Yelpcamp.
      You can also make your own campground, go online and find customers across the globe!</p>
      <p style="color: #fff; line-height: 20px">Email used for login: ${email}</p>
      </div>
      </div>
      `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service
    host: 'mail.google.com', // use your email service host name
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      // use your email and password
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: 'Yelpcamp Login', // Subject line
    text: 'Hello world?', // plain text body
    html: mail, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}
