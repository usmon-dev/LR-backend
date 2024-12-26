import nodemailer from "nodemailer";
import "dotenv/config";

const GOOGLE_APP_SECRET_KEY = process.env.GOOGLE_APP_SECRET_KEY;
const GMAIL = process.env.GMAIL || "";

export const sendMail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GMAIL,
        pass: GOOGLE_APP_SECRET_KEY,
      },
    });

    await transporter.sendMail({
      from: {
        address: GMAIL,
        name: "LR",
      },
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email sent error: " + error);
  }
};
