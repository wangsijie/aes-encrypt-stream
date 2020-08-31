import * as crypto from 'crypto';
import { Transform, Stream, Writable } from 'stream';

const algorithm = 'aes-256-ctr';
let password: Buffer;

function checkPassword() {
    if (!password) {
        throw new Error('You should set password first.');
    }
}

export function generatePassword() {
    return crypto.randomBytes(32);
}

/**
 * set password for encrypting & decryption
 * @param p hex string
 */
export function setPassword(p: Buffer) {
    if (!Buffer.isBuffer(p) || p.length !== 32) {
        throw new Error('password should be 32 length buffer')
    }
    password = p;
}

export function createEncryptStream(input: Stream): Stream {
    checkPassword();
    let passwordLocal =  password;
    const iv = crypto.randomBytes(16);
    const encryptStream = crypto.createCipheriv(algorithm, passwordLocal, iv);
    let inited: boolean = false;
    return input.pipe(encryptStream).pipe(new Transform({
        transform(chunk, encoding, callback) {
            if (!inited) {
                inited = true;
                this.push(Buffer.concat([iv, chunk]));
            } else {
                this.push(chunk);
            }
            callback();
        }
    }));
}

export function createDecryptStream(output: Writable): Transform {
    checkPassword();

    let passwordLocal =  password;

    let iv: string;
    return new Transform({
        transform(chunk, encoding, callback) {
            if (!iv) {
                iv = chunk.slice(0, 16);
                const decryptStream = crypto.createDecipheriv(algorithm, passwordLocal, iv);
                this.pipe(decryptStream).pipe(output);
                this.push(chunk.slice(16));
            } else {
                this.push(chunk);
            }
            callback();
        }
    })
}
