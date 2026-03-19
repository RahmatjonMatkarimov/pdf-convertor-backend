import { readFileSync, unlink, writeFileSync } from 'fs';
import converter from 'libreoffice-convert';
import { basename, extname, join } from 'path';
import { cwd } from 'process';

const convert = async (filename: string): Promise<string> => {
    const filepath = join(cwd(), 'uploads', filename);
    const pdfFilename = basename(filename, extname(filename)) + '.pdf';
    const outdir = join(cwd(), 'uploads', pdfFilename);
    const file = readFileSync(filepath);

    return new Promise((resolve, reject) => {
        converter.convert(file, '.pdf', undefined, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            writeFileSync(outdir, data);
            unlink(filepath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}/uploads/${pdfFilename}`;
            resolve(pdfUrl);
        });
    });
}

export default convert;