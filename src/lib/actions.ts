"use server";

interface UploadResponse {
  message: string;
  files: Array<{
    file_name: string;
    presigned_url: string;
  }>;
}

export async function uploadFiles(
  formData: FormData,
  userId: string
): Promise<UploadResponse> {
  console.log("User ID:", userId);
  const response = await fetch(
    `${process.env.ENDPOINT}/s3/upload?user_id=${userId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload files: ${error}`);
  }

  return response.json();
}

export async function getUserFiles(user_id: string): Promise<UploadResponse> {
  const response = await fetch(
    `${process.env.ENDPOINT}/s3/uploads/${user_id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload files");
  }

  return response.json();
}

export async function handleDeleteFile(fileName: string, userId: string) {
  try {
    if (fileName.startsWith(`${userId}/`)) {
      // Remove o prefixo "userId/"
      fileName = fileName.substring(userId.length + 1);
    }

    const res = await fetch(
      `${process.env.ENDPOINT}/s3/delete/${userId}/${fileName}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete file");
    }
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
  }
}
