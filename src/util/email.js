import nodemailer from 'nodemailer';

const email = async (opt) => {
    const Transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP_GOOGLE, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD_GOOGLE, // generated ethereal password
        },
    });

    const mailOptions = {
        from: 'nguyenducbao1662002@gmail.com',
        to: opt.to,
        subject: opt.subject,
        text: opt.message,
    };

    await Transporter.sendMail(mailOptions);
};

export default email;

// class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[1];
//         this.url = url;
//         this.from = `Hello world <bao@dev.io>`;
//     }

//     newCreateTransport() {
//         return nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.EMAIL_APP_GOOGLE, // generated ethereal user
//                 pass: process.env.EMAIL_APP_PASSWORD_GOOGLE, // generated ethereal password
//             },
//         });
//     }

//     async send(template, subject) {
//         await this.newCreateTransport().sendMail(mailOptions);
//     }

//     async sendWelcome() {
//         await this.send('welcome', 'welcome to the natour family !');
//     }

//     async sendResetPassword() {
//         await this.send(
//             'passwordReset',
//             'Your password token (valid for only 10 minutes)!',
//         );
//     }
// }

// module.exports = Email;
