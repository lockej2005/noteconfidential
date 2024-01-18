// utils/cryptoUtils.js
const nacl = require('tweetnacl');
const util = require('tweetnacl-util');

// Assume SECRET_KEY is a base64 encoded string
const secretKeyUint8Array = util.decodeBase64(process.env.SECRET_KEY);

const encryptText = (text) => {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const messageUint8 = util.decodeUTF8(text);
    const box = nacl.secretbox(messageUint8, nonce, secretKeyUint8Array);

    return {
        nonce: util.encodeBase64(nonce),
        content: util.encodeBase64(box)
    };
};

const decryptText = (encryptedText) => {
    const nonce = util.decodeBase64(encryptedText.nonce);
    const box = util.decodeBase64(encryptedText.content);

    const decryptedMessage = nacl.secretbox.open(box, nonce, secretKeyUint8Array);
    if (!decryptedMessage) {
        throw new Error('Could not decrypt message');
    }

    return util.encodeUTF8(decryptedMessage);
};

module.exports = {
    encryptText,
    decryptText
};
