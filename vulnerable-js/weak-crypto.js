// demonstrates weak hashing (md5) and hardcoded iv/keys (toy example)
const crypto = require('crypto');

function badHash(pass) {
  // insecure: md5
  return crypto.createHash('md5').update(pass).digest('hex');
}

function badEncrypt(plaintext) {
  const key = Buffer.from('00000000000000000000000000000000', 'hex'); // weak/constant key
  const iv = Buffer.alloc(16, 0); // all-zero IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let out = cipher.update(plaintext, 'utf8', 'hex');
  out += cipher.final('hex');
  return out;
}

module.exports = { badHash, badEncrypt };
