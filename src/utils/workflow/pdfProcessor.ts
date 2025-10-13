/**
 * PDF Processing Utilities
 * Extracts text from PDFs using PDF.js and OCR fallback
 */

import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker - Use unpkg for auto-version resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

console.log(`PDF.js version: ${pdfjsLib.version}`);
console.log(`PDF.js worker source: ${pdfjsLib.GlobalWorkerOptions.workerSrc}`);

/**
 * Test PDF.js worker initialization
 */
export const testPDFWorker = async (): Promise<boolean> => {
  try {
    console.log('Testing PDF.js worker initialization...');
    
    // Create a minimal PDF buffer for testing
    const testPDFBuffer = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A, 0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A,
      0x31, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65,
      0x2F, 0x43, 0x61, 0x74, 0x61, 0x6C, 0x6F, 0x67, 0x2F, 0x50, 0x61, 0x67, 0x65, 0x73, 0x20,
      0x32, 0x20, 0x30, 0x20, 0x52, 0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A,
      0x32, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65,
      0x2F, 0x50, 0x61, 0x67, 0x65, 0x73, 0x2F, 0x4B, 0x69, 0x64, 0x73, 0x5B, 0x33, 0x20, 0x30,
      0x20, 0x52, 0x5D, 0x2F, 0x43, 0x6F, 0x75, 0x6E, 0x74, 0x20, 0x31, 0x3E, 0x3E, 0x0A, 0x65,
      0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A, 0x78, 0x72, 0x65, 0x66, 0x0A, 0x30, 0x20, 0x34, 0x0A
    ]);
    
    const loadingTask = pdfjsLib.getDocument({
      data: testPDFBuffer,
      verbosity: 0
    });
    
    await loadingTask.promise;
    console.log('✅ PDF.js worker test successful!');
    return true;
  } catch (error) {
    console.error('❌ PDF.js worker test failed:', error);
    return false;
  }
};

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log(`Starting PDF text extraction for: ${file.name}`);
    console.log(`PDF.js worker source: ${pdfjsLib.GlobalWorkerOptions.workerSrc}`);
    
    const arrayBuffer = await file.arrayBuffer();
    console.log(`PDF file size: ${arrayBuffer.byteLength} bytes`);
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      verbosity: 0
    });
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      fullText += pageText + '\n\n';
      console.log(`Extracted text from page ${pageNum}/${pdf.numPages}`);
    }
    
    const extractedText = fullText.trim();
    console.log(`PDF text extraction completed. Total characters: ${extractedText.length}`);
    
    return extractedText;
  } catch (error: any) {
    console.error('PDF text extraction failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.message?.includes('WorkerMessageHandler') || error.message?.includes('worker')) {
      console.error('PDF.js worker error detected. Try refreshing the page.');
      throw new Error('PDF processing failed: PDF.js worker not properly initialized. Please refresh the page and try again.');
    }
    
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Extract text from image-based PDF using OCR
 */
export const extractTextFromImagePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Process first few pages with OCR (to avoid performance issues)
    const maxPages = Math.min(pdf.numPages, 5);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) continue;
      
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;
        
        // Convert canvas to blob for OCR
        const blob: Blob = await new Promise(resolve => 
          canvas.toBlob(b => resolve(b as Blob), 'image/png')
        );
        
        // Use Tesseract.js for OCR
        const { data: { text } } = await Tesseract.recognize(blob, 'eng', {
          logger: m => console.log(m)
        });
        
        fullText += text + '\n\n';
      } finally {
        // Clean up canvas to prevent memory leak
        canvas.width = 0;
        canvas.height = 0;
        canvas.remove();
      }
    }
    
    return fullText.trim();
  } catch (error: any) {
    console.error('OCR extraction failed:', error);
    throw new Error(`Failed to extract text using OCR: ${error.message}`);
  }
};

/**
 * Smart PDF text extraction - tries text extraction first, falls back to OCR
 */
export const smartPDFExtraction = async (file: File): Promise<{ text: string; method: string }> => {
  try {
    // First try regular text extraction
    const text = await extractTextFromPDF(file);
    
    // Check if we got meaningful text
    if (text.length > 50 && text.trim().split(/\s+/).length > 5) {
      return { text, method: 'text_extraction' };
    }
    
    // If text extraction didn't work well, try OCR
    console.log('Text extraction yielded poor results, trying OCR...');
    const ocrText = await extractTextFromImagePDF(file);
    return { text: ocrText, method: 'ocr' };
    
  } catch (error: any) {
    console.error('Smart PDF extraction failed:', error);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
};

/**
 * Check if PDF is likely to be image-based (scanned document)
 */
export const isImageBasedPDF = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    
    // If very little text content, likely image-based
    const textLength = textContent.items
      .map((item: any) => item.str)
      .join('')
      .trim().length;
    
    return textLength < 100;
  } catch (error) {
    console.error('PDF analysis failed:', error);
    return false;
  }
};


