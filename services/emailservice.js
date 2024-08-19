const noidemailer = require('nodemailer');
async function sendMail({ from, to, subject, text, html}){
    try{
    let transporter = noidemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user:process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let info = await transporter.sendMail({
        from:`Reacher <${from}>` ,
        to,
        subject,
        text,
        html

    });
    console.log('Message sent: %s', info.messageId);
} catch (error) {
    console.error('Error occurred: ', error);
}
}


module.exports = sendMail;