import multer from 'multer';

const storage = multer.memoryStorage()

export const allowUpload = multer({storage})