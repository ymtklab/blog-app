'use strict';
function isAdmin(req) {
  // ユーザー名とパスワードを変える場合は、views/blog.pug も変更してください。
  let admin = req.session.login.username === 'admin' && req.session.login.password === '123456789';
  if (admin) {
    return true;
  }
}

module.exports = isAdmin;