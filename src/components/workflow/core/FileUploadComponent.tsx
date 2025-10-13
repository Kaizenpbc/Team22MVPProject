import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadComponentProps {
  onFileUpload: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  uploadedFileName?: string;
}

/**
 * File Upload Component
 * Handles drag-and-drop and click-to-upload for SOP documents
 */
const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onFileUpload,
  onDrop,
  onDragOver,
  uploadedFileName
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📁 Upload Document
      </h3>
      
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => document.getElementById('fileInput')?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-gray-50 dark:bg-gray-800"
      >
        <input
          id="fileInput"
          type="file"
          accept=".txt,.md,.pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(file);
          }}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          Drop your SOP file here or click to browse
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports: PDF, Word, Text, Markdown
        </p>
        
        {uploadedFileName && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Loaded: <span className="font-semibold">{uploadedFileName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;

