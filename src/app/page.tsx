"use client";

import { Dropzone } from "@/components/Dropzone";
import React, { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FilesCard } from "@/components/FilesCard";
import { useAuth } from "@clerk/nextjs";
import { getUserFiles, handleDeleteFile } from "@/lib/actions";
import { getAnonymousId } from "@/lib/utils";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ file_name: string; presigned_url: string }>
  >([]);

  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    const handleUserFiles = async (id: string) => {
      try {
        const files = await getUserFiles(id);
        if (files.files?.length >= 1) {
          setUploadedFiles(files.files);
        } else {
          setUploadedFiles([]);
        }
      } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
        setUploadedFiles([]);
      }
    };

    const id = isSignedIn ? userId : getAnonymousId();

    setUploadedFiles([]);

    handleUserFiles(id);
  }, [isSignedIn, userId]);

  const deleteFile = async (fileName: string) => {
    const id = isSignedIn ? userId : getAnonymousId();
    await handleDeleteFile(fileName, id).then(() => {
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.file_name !== fileName)
      );
    });
  };

  const handleUploadComplete = (
    files: Array<{ file_name: string; presigned_url: string }>
  ) => {
    setUploadedFiles([...uploadedFiles, ...files]);
    console.log("Uploaded files:", files);
  };

  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-center mt-2">
          <h3 className="font-medium ">
            Arraste arquivos para compartilhar e esqueçer!
          </h3>
        </div>
        <Dropzone
          onUploadComplete={handleUploadComplete}
          maxFiles={5}
          maxSize={1024 * 1024 * 5} // 5MB
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".gif"],
            "application/pdf": [".pdf"],
          }}
        />
        <FilesCard files={uploadedFiles} onDeleteFile={deleteFile} />
      </div>
    </TooltipProvider>
  );
}
