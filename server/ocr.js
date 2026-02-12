import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromImage(buffer) {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    await worker.terminate();
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image');
  }
}

export async function extractTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;
  
  // PDF files
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(buffer);
  }
  
  // Image files (PNG, JPG, JPEG)
  if (mimetype.startsWith('image/')) {
    return await extractTextFromImage(buffer);
  }
  
  // Text files
  if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }
  
  throw new Error(`Unsupported file type: ${mimetype}`);
}
