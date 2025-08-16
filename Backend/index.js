import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Build HTML table from an object
function textTable(obj) {
  const rows = Object.entries(obj)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 8px; font-weight:600; vertical-align:top;">${escapeHtml(
          k
        )}</td>
        <td style="padding:6px 8px; vertical-align:top;">${escapeHtml(v)}</td>
      </tr>`
    )
    .join("");

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; color:#111; line-height:1.4; margin:0; padding:20px;">
    <table role="presentation" style="width:100%; max-width:600px; border-collapse:collapse;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>
  `;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.send("hellow world");
});


// app.post("/api/user/enq", async (request, response) => {
//   const { name, email, phone, subject, message } = request?.body || {};

//   try {
//     const transporter = nodemailer.createTransport({
//       secure: true,
//       host: "smtp.gmail.com",
//       port: 465,
//       auth: {
//         user: process.env.SENDER_EMAIL,
//         pass: process.env.SENDER_PASSKEY,
//       },
//       tls: {
//         rejectUnauthorized: false, // ⚠️ Only for testing, remove in prod
//       },
//     });

//     // Reusable function to send email
//     const sendMail = async (to, subject, html) => {
//       return await transporter.sendMail({
//         from: process.env.SENDER_EMAIL,
//         to,
//         subject,
//         html,
//       });
//     };

//     try {
//       // 1 Send enquiry email to Receiver (you)
//       await sendMail(
//         process.env.RECIEVER_EMAIL,
//         subject || "New Contact Form Submission",
//         textTable({ name, email, phone, subject, message })
//       );

//       // 2 Send confirmation email to User
//       // await sendMail(
//       //   email,
//       //   "We received your enquiry",
//       //   `<p>Hi ${name || "there"},</p>
//       //    <p>Thank you for reaching out. We have received your message and will get back to you shortly.</p>
//       //    <br/>
//       //    <p>Best regards,<br/>Support Team</p>`
//       // );

//       response.send({ status: "success", message: "Email sent to both receiver and user!" });
//     } catch (error) {
//       response.status(500).send({ status: "request failed!", message: error.message });
//     }
//   } catch (error) {
//     console.log("error:- ", error);
//     response.status(500).send({ status: "server error", message: error.message });
//   }
// });

app.post("/api/user/enq", async (request, response) => {
  const { name, email, phone, subject, message } = request?.body || {};

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSKEY,
      },
    });

    // Reusable function to send email
    const sendMail = async (to, subject, html) => {
      return await transporter.sendMail({
        from: `"New Equiry" <${process.env.SENDER_EMAIL}>`, // friendly "from" name
        to,
        subject,
        html,
      });
    };

    try {
      // 1 Send enquiry email to Receiver (you/admin)
      await sendMail(
        process.env.RECIEVER_EMAIL,
        subject || "New Contact Form Submission",
        textTable({ name, email, phone, subject, message })
      );

      // 2 Send confirmation email to User
      // await sendMail(
      //   email,
      //   "We received your enquiry ✔",
      //   `<p>Hi ${name || "there"},</p>
      //    <p>Thank you for reaching out! We’ve received your enquiry and will get back to you shortly.</p>
      //    <br/>
      //    <p>Best regards,<br/>Support Team</p>`
      // );

      response.send({ status: "success", message: "Email sent to receiver and confirmation sent to user!" });
    } catch (error) {
      response.status(500).send({ status: "request failed", message: error.message });
    }
  } catch (error) {
    console.log("error:- ", error);
    response.status(500).send({ status: "server error", message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
