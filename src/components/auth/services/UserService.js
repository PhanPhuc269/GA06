const User = require('../models/User');
const nodemailer = require('nodemailer');
const mjml = require('mjml');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UserService {
    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async findUserByUserId(userId) {
        return await User.findById(userId);
    }

    async registerUser(username, email, password) {
        // Kiểm tra định dạng email
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        // Create new user
        const user = new User({ username, password, email, isConfirmed: false });
        await user.save();

        // Send confirmation email using Nodemailer
        //this.sendConfirmationEmailWithSendGrid(user);

        return user;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async sendConfirmationEmail(user) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject("Failed to create access token :(");
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // Read and compile MJML template
        const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, '../views/emails/confirmation.mjml'), 'utf8');
        const { html } = mjml(mjmlTemplate, {
            filePath: path.resolve(__dirname, '../views/emails')
        });

        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: user.email,
            subject: 'Account Confirmation',
            html: html.replace('{{username}}', user.username).replace('{{host}}', process.env.HOST).replace('{{token}}', token)
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
        }
    }

    async sendVerificationCode(req, user) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
        req.session.verificationCode = verificationCode;
        await user.save();

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject("Failed to create access token :(");
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // Read and compile MJML template
        const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, '../views/emails/verification-code.mjml'), 'utf8');
        const { html } = mjml(mjmlTemplate, {
            filePath: path.resolve(__dirname,'../views/emails')
        });

        const mailOptions = {
            from: `"Dimillav" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verification Code',
            html: html.replace('{{username}}', user.username).replace('{{verificationCode}}', verificationCode)
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification code sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send verification code to ${user.email}:`, error);
        }
    }

    async sendConfirmationEmailWithSendGrid(user) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Read and compile MJML template
        const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, '../views/emails/confirmation.mjml'), 'utf8');
        const { html } = mjml(mjmlTemplate, {
            filePath: path.resolve(__dirname,'../views/emails')
        });

        const msg = {
            to: user.email,
            from: `Dimillav <${process.env.SENDGRID_EMAIL}>`, // Use the email address or domain you verified with SendGrid
            subject: 'Account Confirmation',
            html: html.replace('{{username}}', user.username).replace('{{host}}', process.env.HOST).replace('{{token}}', token)
        };

        try {
            await sgMail.send(msg);
            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
        }
    }

    async sendVerificationCodeWithSendGrid(req, user) {
        const cryptoRandomString = (await import('crypto-random-string')).default;
        const verificationCode = cryptoRandomString({ length: 6, type: 'numeric' });
        req.session.verificationCode = verificationCode;
        req.session.verificationCodeExpires = Date.now() + 300000; // 5 minutes from now

        // Read and compile MJML template
        const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, '../views/emails/verification-code.mjml'), 'utf8');
        const { html } = mjml(mjmlTemplate, {
            filePath: path.resolve(__dirname,'../views/emails')
        });

        const msg = {
            to: user.email,
            from: `Dimillav ${process.env.SENDGRID_EMAIL}`, // Use the email address or domain you verified with SendGrid
            subject: 'Verification Code',
            html: html.replace('{{username}}', user.username).replace('{{verificationCode}}', verificationCode)
        };

        try {
            await sgMail.send(msg);
            console.log(`Verification code sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send verification code to ${user.email}:`, error);
        }
    }


    async verifyCode(req, email, verificationCode) {
        const user = await this.findUserByEmail(email);
        if (!user || req.session.verificationCode !== verificationCode) {
            throw new Error('Invalid verification code');
        }
        if (Date.now() > req.session.verificationCodeExpires) {
            throw new Error('Verification code has expired');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.password = newPassword;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    async confirmAccount(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.isConfirmed = true;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

module.exports = new UserService();



















// const { google } = require('googleapis');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const nodemailer = require('nodemailer');
// const mjml = require('mjml');
// const fs = require('fs');
// const path = require('path');

// class UserService {
//     async findUserByEmail(email) {
//         return await User.findOne({ email });
//     }
//     async findUserByUserId(userId) {
//         return await User.findById(userId);
//     }
//     async registerUser(username, email, password) {
//         // Kiểm tra định dạng email
//         if (!this.isValidEmail(email)) {
//             throw new Error('Invalid email format');
//         }

//         // Check if the username already exists
//         const existingUser = await User.findOne({ username: username });
//         if (existingUser) {
//             throw new Error('Username already exists');
//         }

//         // Check if the email already exists
//         const existingEmail = await User.findOne({ email: email });
//         if (existingEmail) {
//             throw new Error('Email already exists');
//         }

//         // Create new user
//         const user = new User({ username, password, email, isConfirmed: false });
//         await user.save();

//         return user;
//     }

//     isValidEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     async sendConfirmationEmail(user) {
//         try{
//             const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
//             const oauth2Client = new google.auth.OAuth2(
//                 process.env.CLIENT_ID,
//                 process.env.CLIENT_SECRET,
//                 "https://developers.google.com/oauthplayground"
//             );
    
//             oauth2Client.setCredentials({
//                 refresh_token: process.env.REFRESH_TOKEN
//             });
    
//             const accessToken = await new Promise((resolve, reject) => {
//                 oauth2Client.getAccessToken((err, token) => {
//                     if (err) {
//                         reject("Failed to create access token :(");
//                     }
//                     resolve(token);
//                 });
//             });
    
//             const transporter = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     type: 'OAuth2',
//                     user: process.env.EMAIL_USER,
//                     clientId: process.env.CLIENT_ID,
//                     clientSecret: process.env.CLIENT_SECRET,
//                     refreshToken: process.env.REFRESH_TOKEN,
//                     accessToken: accessToken
//                 }
//             });
    
//             // Read and compile MJML template
//             const mjmlTemplate = fs.readFileSync(path.resolve(__dirname,'../views/emails/confirmation.mjml'), 'utf8');
//             const { html } = mjml(mjmlTemplate, {
//                 filePath: path.resolve(__dirname,'../views/emails')
//             });
    
//             const mailOptions = {
//                 from: `"Dimillav" <${process.env.EMAIL_USER}>`,
//                 to: user.email,
//                 subject: 'Account Confirmation',
//                 html: html.replace('{{username}}', user.username).replace('{{host}}', process.env.HOST).replace('{{token}}', token)
//             };
    
//             await transporter.sendMail(mailOptions);
//         }
//         catch(error){
//             console.log(error);
//         }
//     }

//     async sendVerificationCode(user) {
//         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
//         user.verificationCode = verificationCode;
//         await user.save();

//         const oauth2Client = new google.auth.OAuth2(
//             process.env.CLIENT_ID,
//             process.env.CLIENT_SECRET,
//             "https://developers.google.com/oauthplayground"
//         );

//         oauth2Client.setCredentials({
//             refresh_token: process.env.REFRESH_TOKEN
//         });

//         const accessToken = await new Promise((resolve, reject) => {
//             oauth2Client.getAccessToken((err, token) => {
//                 if (err) {
//                     reject("Failed to create access token :(");
//                 }
//                 resolve(token);
//             });
//         });

//         const transporter = nodemailer.createTransport({
//             service: 'Gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: process.env.EMAIL_USER,
//                 clientId: process.env.CLIENT_ID,
//                 clientSecret: process.env.CLIENT_SECRET,
//                 refreshToken: process.env.REFRESH_TOKEN,
//                 accessToken: accessToken
//             }
//         });

//         // Read and compile MJML template
//         const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, '../views/emails/verification-code.mjml'), 'utf8');
//         const { html } = mjml(mjmlTemplate, {
//             filePath: path.resolve(__dirname,'../views/emails')
//         });

//         const mailOptions = {
//             from: `"Dimillav" <${process.env.EMAIL_USER}>`,
//             to: user.email,
//             subject: 'Verification Code',
//             html: html.replace('{{username}}', user.username).replace('{{verificationCode}}', verificationCode)
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             console.log(`Verification code sent to ${user.email}`);
//         } catch (error) {
//             console.error(`Failed to send verification code to ${user.email}:`, error);
//         }
//     }

//     async verifyCode(email, verificationCode) {
//         const user = await this.findUserByEmail(email);
//         if (!user || user.verificationCode !== verificationCode) {
//             throw new Error('Invalid verification code');
//         }
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         return token;
//     }

//     async resetPassword(token, newPassword) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const user = await User.findById(decoded.userId);
//             if (!user) {
//                 throw new Error('User not found');
//             }
//             user.password = newPassword;
//             await user.save();
//             return user;
//         } catch (error) {
//             throw new Error('Invalid or expired token');
//         }
//     }
//     async confirmAccount(token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const user = await User.findById(decoded.userId);
//             if (!user) {
//                 throw new Error('User not found');
//             }
//             user.isConfirmed = true;
//             await user.save();
//             return user;
//         } catch (error) {
//             throw new Error('Invalid or expired token');
//         }
//     }
// }

// module.exports = new UserService();