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
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center gap-3">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => document.getElementById('fileInput')?.click()}
          className="flex-1 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
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
          
          <Upload className="w-4 h-4 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {uploadedFileName ? (
              <p className="text-sm text-gray-900 dark:text-white truncate">
                ✓ <span className="font-medium">{uploadedFileName}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📁 Click or drop file • PDF, Word, Text, MD
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;

