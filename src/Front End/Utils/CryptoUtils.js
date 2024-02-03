// src/utils/cryptoUtils.js

import nacl from 'tweetnacl';
import { decodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

export const generateKeyPair = () => {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
};

export const signNote = (note, secretKey) => {
  const noteUint8Array = decodeUTF8(note);
  const signedMessage = nacl.sign.detached(noteUint8Array, decodeBase64(secretKey));
  return encodeBase64(signedMessage);
};

export const verifySignature = (note, signature, publicKey) => {
  const noteUint8Array = decodeUTF8(note);
  const signatureUint8Array = decodeBase64(signature);
  return nacl.sign.detached.verify(noteUint8Array, signatureUint8Array, decodeBase64(publicKey));
};
