const busboy = require('busboy');
const { PassThrough } = require('stream');

const maxFileSizeInBytes = 1024 * 1024 * 1024;

function getContentType(headers) {
    if (headers['content-type']) {
        return headers['content-type'];
    }
    return headers['Content-Type'];
}

module.exports = (req, res, next) => {
    try {
        const contentType = getContentType(req.headers);

        if (!contentType) {
            throw new Error('Request is empty');
        }

        const bb = busboy({ headers: req.headers });
        req.pipe(bb);

        bb.on('file', async (name, file, info) => {
            // form data should contain the uploaded file in "file" field
            // we are processing only single file upload.
            if (name == 'file') {
                // file type validation goes here
                const { mimeType } = info;
                if (!mimeType.includes('text/')) {
                    return bb.emit('error', new Error('Unsupported file format.'));
                }

                const stream = new PassThrough({ highWaterMark: maxFileSizeInBytes }); // supports upto 1 GB
                file.pipe(stream)
                req.file = stream;
            } else { // all other files are ignored here
                process.nextTick(() => {
                    file.resume();
                });
            }

        });

        bb.on('close', () => {
        })

        bb.on('field', (name, val, info) => {
            // we do not need form data fields right now. later we can levarage and add them to req.body
            console.log(`Field [${name}]: value: %j`, val);
        });

        bb.on('finish', () => {
            if (!req.file) {
                return bb.emit('error', new Error('File missing at the required path'));
            }
            next();
        });

        bb.on('error', (err) => {
            req.unpipe(bb);

            return next(err);
        });

    } catch (err) {
        return next(err);
    }
}