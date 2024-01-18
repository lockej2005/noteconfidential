const nacl = require('tweetnacl');
const util = require('tweetnacl-util');

const keyPair = nacl.sign.keyPair();
const publicKey = util.encodeBase64(keyPair.publicKey);
const secretKey = util.encodeBase64(keyPair.secretKey);

console.log(`Public Key: ${publicKey}`);
console.log(`Secret Key: ${secretKey}`);