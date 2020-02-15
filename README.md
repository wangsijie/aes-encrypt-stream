# aes-encrypt-stream

Implement aes-256-ctr encryption/decryption with stream. Automaticly generate IV for each encryption and store iv(16 bytes) in the start of the encyrpted data.

## Instalation

```
npm i aes-encrypt-stream
```

## Basic Usage

```js
const fs = require('fs');
const { createEncryptStream, createDecryptStream, setPassword } = require('aes-encrypt-stream');

// password: 256 bit buffer
setPassword(Buffer.from('f8647d5417039b42c88a75897109049378cdfce528a7e015656bd23cd18fb78a', 'hex'));

// encrypt
createEncryptStream(fs.createReadStream('origin.txt')).pipe(fs.createWriteStream('encrypted.txt'))

// decrypt
// fs.createReadStream('encrypted.txt').pipe(createDecryptStream(fs.createWriteStream('decrypted.txt')));

```

## Generate Password

```js
const { generatePassword } = require('aes-encrypt-stream');
console.log(generatePassowrd().toString('hex'));
```

## Advanced Usage

Used with express to send decrypted data stream:

```js
const express = require('express');
const fs = require('fs');
const { createDecryptStream, setPassword } = require('aes-encrypt-stream');

setPassward(Buffer.from('f8647d5417039b42c88a75897109049378cdfce528a7e015656bd23cd18fb78a', 'hex'));

const app = express();
app.get('/', (req, res) => {
    const readStream = fs.createReadStream('encrypted.txt');
    readStream.pipe(createDecryptStream(res));
});

app.listen(3000);
```
