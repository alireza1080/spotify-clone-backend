import fileUpload from 'express-fileupload';

const temporaryFileUpload = fileUpload({
  useTempFiles: true,
  tempFileDir: './temp',
  createParentPath: true,
  limits: {
    fileSize: 1024 * 1024 * 11,
  },
  abortOnLimit: true,
  responseOnLimit: 'File too large',
  debug: false,
  safeFileNames: true,
  preserveExtension: true,
  uploadTimeout: 10000,
});

export default temporaryFileUpload;
