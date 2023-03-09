import { UPPER_PARTIAL, LOWER_PARTIAL, DECOMPRESSED_CENTRAL } from './musdata';
import zlib, { Z_DEFAULT_COMPRESSION } from 'zlib';
import CRC32 from 'crc-32';

function constructBody(
    title: string,
    gameName: string,
    composer: string,
    arranger: string,
    copyrightCompany: string,
    copyrightYear: string
): Uint8Array {
    if (!title.startsWith('"')) {
        title = '"' + title;
    }
    if (!title.endsWith('"')) {
        title = title + '"';
    }

    let utf8String = Buffer.from(DECOMPRESSED_CENTRAL, 'base64').toString('utf-8');
    utf8String = utf8String.replaceAll('[title]', title);
    utf8String = utf8String.replaceAll('[game]', gameName);
    utf8String = utf8String.replaceAll('[composer]', composer);
    utf8String = utf8String.replaceAll('[arranger]', arranger);
    utf8String = utf8String.replaceAll('[company]', copyrightCompany);
    utf8String = utf8String.replaceAll('[year]', copyrightYear);

    const utf8Encode = new TextEncoder();
    const out = utf8Encode.encode(utf8String);

    const crc32Hash = CRC32.buf(out);
    const crcBuffer = numberToBytes(crc32Hash);

    const compressedPayload = zlib.deflateSync(Buffer.from(out), {
        level: Z_DEFAULT_COMPRESSION,
    });
    const totalBlockLength = compressedPayload.length + 4 + 6;
    const lengthBuffer = numberToBytes(totalBlockLength);

    const combinedArray = concatUint8Arrays([
        new Uint8Array([0x17, 0x00]),
        lengthBuffer,
        crcBuffer,
        new Uint8Array(
            compressedPayload.buffer,
            compressedPayload.byteOffset,
            compressedPayload.byteLength / Uint8Array.BYTES_PER_ELEMENT
        ),
    ]);

    const upperBit = Buffer.from(UPPER_PARTIAL, 'base64');
    const upperArray = new Uint8Array(
        upperBit.buffer,
        upperBit.byteOffset,
        upperBit.byteLength / Uint8Array.BYTES_PER_ELEMENT
    );

    const lowerBit = Buffer.from(LOWER_PARTIAL, 'base64');
    const lowerArray = new Uint8Array(
        lowerBit.buffer,
        lowerBit.byteOffset,
        lowerBit.byteLength / Uint8Array.BYTES_PER_ELEMENT
    );

    const everythingAllTogether = concatUint8Arrays([upperArray, combinedArray, lowerArray]);
    return everythingAllTogether;
}

function numberToBytes(num: number) {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, num, true);
    return new Uint8Array(arr);
}

function concatUint8Arrays(arrays: Uint8Array[]) {
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

    const result = new Uint8Array(totalLength);
    let length = 0;
    for (let array of arrays) {
        result.set(array, length);
        length += array.length;
    }

    return result;
}

export function createAndDownloadBlobFile(
    title: string,
    gameName: string,
    composer: string,
    arranger: string,
    copyrightCompany: string,
    copyrightYear: string
) {
    const blob = new Blob([constructBody(title, gameName, composer, arranger, copyrightCompany, copyrightYear)]);
    const safeFilename =
        gameName.replaceAll(/[^a-zA-Z0-9]/g, '_') + '-' + title.replaceAll('"', '').replaceAll(/[^a-zA-Z0-9]/g, '_');
    debugger;

    const fileName = `${safeFilename}.mus`;

    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
