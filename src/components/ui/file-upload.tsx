"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onFileRemove: () => void
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  onFileRemove,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  className
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    maxSize,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    }
  })

  if (selectedFile) {
    return (
      <div className={cn("rounded-lg border border-gray-200 p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all",
        isDragActive && !isDragReject && "border-orange-500 bg-orange-50",
        isDragReject && "border-red-500 bg-red-50",
        !isDragActive && !isDragReject && "border-gray-300 hover:border-gray-400",
        className
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <p className="text-lg font-medium text-gray-900">
          {isDragActive ? "Drop your resume here" : "Upload your resume"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          PDF, DOC, or DOCX files up to 10MB
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Click to browse or drag and drop
        </p>
      </div>
    </div>
  )
} 