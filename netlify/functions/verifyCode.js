const fs = require("fs");
const { getCode } = require("./sendCode");
const usersFile = './netlify/functions/users.json';

exports.handler = async function(event) {
  const { email, code, newPassword, password, login } = JSON.parse(event.body);

  const users = JSON.parse(fs.readFileSync(usersFile));

  if(login){
    const user = users.find(u => u.email === email && u.password === password);
    if(user){
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "✅ تم تسجيل الدخول بنجاح!" })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: "❌ البريد أو كلمة المرور خاطئة." })
      };
    }
  }

  const expectedCode = getCode(email);

  if(code === expectedCode){
    const userIndex = users.findIndex(u => u.email === email);
    if(userIndex !== -1){
      users[userIndex].password = newPassword;
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "✅ تم إعادة تعيين كلمة المرور بنجاح!" })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: "❌ البريد غير موجود." })
      };
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: "❌ الكود غير صحيح." })
    };
  }
};
