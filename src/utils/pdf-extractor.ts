const pdfParse = require('pdf-parse');

/**
 * Extracts text from a PDF buffer.
 * @param buffer The PDF file buffer
 * @returns The extracted text as a string
 */
export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file.');
  }
};
