import { expect } from 'chai';
import 'mocha';
import { randomBytes } from 'crypto';
import { Readable, Writable } from 'stream';
import { generatePassword, setPassword, createEncryptStream, createDecryptStream } from './index';

describe('generate password', 
    () => {
        const password = generatePassword();
        it('should be 32 length buffer', () => {
            expect(password.length).to.equal(32); 
        });
    }
);

describe('encrypt and decrypt',
    () => {
        const origin = randomBytes(128);
        let encrypted: Buffer = Buffer.alloc(0);
        let decrypted: Buffer = Buffer.alloc(0);
        before((callback) => {
            setPassword(generatePassword());
            const inputStream = new Readable({
                read() {}
            });
            const outputStream = new Writable({
                write(chunk, _, callback) {
                    encrypted = Buffer.concat([encrypted, chunk]);
                    callback();
                }
            });
            const inputStream2 = new Readable({
                read() {}
            });
            const outputStream2 = new Writable({
                write(chunk, _, callback) {
                    decrypted = Buffer.concat([decrypted, chunk]);
                    callback();
                }
            });
            createEncryptStream(inputStream).pipe(outputStream);
            outputStream.on('finish', () => {
                inputStream2.pipe(createDecryptStream(outputStream2));
                inputStream2.push(encrypted);
                inputStream2.push(null);
                outputStream2.on('finish', () => {
                    callback();
                })
            })
            inputStream.push(origin);
            inputStream.push(null);
        })

        it('encrypted data should be longer for 16', () => {
            expect(encrypted.length).to.equal(origin.length + 16);
        })

        it('decrypted should be equel to origin', () => {
            expect(Buffer.compare(origin, decrypted)).to.equal(0);
        })
    }
);
