"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import { UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilePreview from "@/components/file-preview";
import { uploadFiles } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { getAnonymousId } from "@/lib/utils";

interface DropzoneProps {
  onUploadComplete: (
    files: Array<{ file_name: string; presigned_url: string }>
  ) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function Dropzone({
  onUploadComplete,
  maxFiles = 0,
  maxSize = 1024 * 1024 * 10,
  accept,
}: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ file_name: string; presigned_url: string }>
  >([]);
  const { userId, isSignedIn } = useAuth();

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setRejected((prevRejected) => [...prevRejected, ...fileRejections]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  const removeFile = (file: File) => {
    setFiles((files) => files.filter((f) => f !== file));
    setUploadedFiles((uploadedFiles) =>
      uploadedFiles.filter((f) => f.file_name !== file.name)
    );
  };

  const removeRejected = (rejected: FileRejection) => {
    setRejected((files) => files.filter((r) => r !== rejected));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const id = isSignedIn ? userId : getAnonymousId();

      const response = await uploadFiles(formData, id);
      setUploadedFiles(response.files);
      onUploadComplete(response.files);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div
        {...getRootProps()}
        className={`p-8 text-center border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Arraste e solte arquivos aqui, ou clique aqui para selecionar os
          arquivos!
        </p>
        <Button className="mt-4" variant="outline">
          Selecionar arquivos!
        </Button>
      </div>

      {/* Preview */}
      <div className="mt-6 space-y-4">
        {files.map((file) => {
          const uploadedFile = uploadedFiles.find((f) =>
            f.file_name.includes(file.name)
          );
          return (
            <FilePreview
              key={file.name}
              file={file}
              onRemove={() => removeFile(file)}
              presignedUrl={uploadedFile?.presigned_url}
            />
          );
        })}
      </div>

      {/* Rejected files */}
      {rejected.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Arquivos rejeitados
          </h3>
          <ul className="mt-2 space-y-2">
            {rejected.map(({ file, errors }) => (
              <li
                key={file.name}
                className="flex items-center space-x-2 text-sm text-red-500"
              >
                <AlertCircle className="h-5 w-5" />
                <span>
                  {file.name} - {errors[0].message}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRejected({ file, errors })}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <Button className="mt-4" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Enviando..." : "Enviar Arquivos!"}
        </Button>
      )}
    </div>
  );
}
