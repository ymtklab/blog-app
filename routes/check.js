'use strict';
// ログインしているかをチェック
function check(req, res) {
  if (!req.session.login) {
    res.redirect('/users/login');
    return true;
  } else{
    return false;
  }
}

module.exports = check;