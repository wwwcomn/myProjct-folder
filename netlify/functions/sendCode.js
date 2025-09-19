const fetch = require("node-fetch");
const fs = require("fs");
let codes = {}; // لتخزين الكود مؤقت لكل بريد

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

async function sendToBot(email, code) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `كود إعادة تعيين كلمة المرور للبريد ${email}: ${code}`
    })
  });
}

exports.handler = async function(event) {
  const { email } = JSON.parse(event.body);

  // توليد كود عشوائي
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[email] = code; // تخزين مؤقت

  console.log(`الكود المولد للبريد ${email}: ${code}`);

  try {
    await sendToBot(email, code);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "تم إرسال الكود للبوت وتم حفظه في الخادم." })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "حدث خطأ أثناء إرسال الكود." })
    };
  }
};

exports.getCode = (email) => codes[email];
