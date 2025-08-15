import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

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

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.send("hellow world");
});

app.post("/api/user/enq", (request, response) => {
  console.log("check:- ", request.body);
  const { name, email, phone, subject, message } = request?.body || {};

  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "from_user",
        pass: "app_password",
      },
      tls: {
        rejectUnauthorized: false, // bypass cert check
      },
    });

    const sendMail = async (to, obj) => {
      const info = await transporter.sendMail({
        from: "from_user",
        to,
        subject: "test node js.",
        html: textTable(obj),
      });
    };
    sendMail(email, request?.body);
  } catch (error) {
    console.log("error:- ", error);
  }
  response.send({
    req: "success",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
