/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { X, Link, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  presignedUrl?: string;
}

export default function FilePreview({
  file,
  onRemove,
  presignedUrl,
}: FilePreviewProps) {
  const [copied, setCopied] = useState(false);
  const isImage = file.type.startsWith("image/");

  const handleCopy = async () => {
    if (presignedUrl) {
      await navigator.clipboard.writeText(presignedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-xl font-medium uppercase">
                {file.name.split(".").pop()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            {presignedUrl && (
              <div className="flex items-center mt-1 space-x-2">
                <a
                  href={presignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <Link className="w-4 h-4 mr-1" />
                  Ver arquivo
                </a>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />{" "}
                            <p> Copiar Link</p>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" /> <p>Copiar Link</p>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copiado!" : "Copiar Link"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
