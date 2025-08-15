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

const data = [
    {
        "id": 1,
        "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        "price": 109.95,
        "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        "rating": {
            "rate": 3.9,
            "count": 120
        }
    },
    {
        "id": 2,
        "title": "Mens Casual Premium Slim Fit T-Shirts ",
        "price": 22.3,
        "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
        "rating": {
            "rate": 4.1,
            "count": 259
        }
    },
    {
        "id": 3,
        "title": "Mens Cotton Jacket",
        "price": 55.99,
        "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
        "rating": {
            "rate": 4.7,
            "count": 500
        }
    },]

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.send("hellow world");
});
app.get("/api/products", (req, resp) => {
  resp.send({
    status: "success",
    data,
  });
});

app.post("/api/user/enq", async(request, response) => {
  // console.log("check:- ", request.body);
  const { name, email, phone, subject, message } = request?.body || {};

  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env._USER,
        pass: process.env._PASS,
      },
      tls: {
        rejectUnauthorized: false, // bypass cert check
      },
    });

    const sendMail = async (to, obj) => {
      const info = await transporter.sendMail({
        from: process.env._USER,
        to:process.env._USER,
        subject: obj?.subject,
        html: textTable(obj),
      });
    };
    try {
      
     const _data = await sendMail(email, request?.body);
      response.send({status: "success",message:"email sent!"})
    } catch (error) {
      response.send({status: "request failed!",message:error.message})
    }
  } catch (error) {
    console.log("error:- ", error);
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
