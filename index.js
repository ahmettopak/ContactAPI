const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(cors());

// E-posta gönderme fonksiyonu
function sendMail(data) {

    console.log(data)
    const transporter = nodemailer.createTransport({

        host: 'mail.elektrolanddefence.com', // SMTP sunucusu
        port: 587, // SMTP portu genellikle 587 veya 465 olabilir, sağlayıcınızın gereksinimlerine göre değişebilir
        tls: false,
        auth: {
            user: process.env.EMAIL, // E-posta adresinizi buraya girin
            pass: process.env.EMAIL_PASS // E-posta şifrenizi buraya girin
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        // to: process.env.RECIPIENT_EMAIL, // Alıcı e-posta adresi
        to: process.env.RECIPIENT_EMAIL,
        subject: 'New Contact Form Submission', // E-posta konusu
        html: `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><p>Phone: ${data.phone}</p><p>Description: ${data.description}</p>` // E-posta gövdesi (HTML formatında)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('E-posta gönderildi: ' + info.response);
        }
    });
}

// Kullanıcıdan gelen bilgilerle e-posta gönderme
app.post('/contact', (req, res) => {
    const userData = req.body;

    // Kullanıcıdan gelen bilgilerle e-posta gönderme fonksiyonunu çağırma


    if(userData.success){
        sendMail(userData);

        // Kullanıcıya yanıt gönderme
        res.json({ message: 'Your message has been sent successfully.' });
    }
    
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
