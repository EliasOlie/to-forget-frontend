/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileIcon, ImageIcon, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileInfo {
  file_name: string;
  presigned_url: string;
}

interface FilesCardProps {
  files: FileInfo[];
  onDeleteFile: (fileName: string) => void;
}

export function FilesCard({ files, onDeleteFile }: FilesCardProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyLink = async (url: string, fileName: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedStates((prev: any) => ({ ...prev, [fileName]: true }));
    setTimeout(() => {
      setCopiedStates((prev: any) => ({ ...prev, [fileName]: false }));
    }, 2000);
  };

  return (
    <div className="w-full px-6">
      <h3 className="font-semibold">Arquivos enviados</h3>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {file.file_name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={file.presigned_url}
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : file.file_name.match(/\.(pdf)$/i) ? (
                  <FileIcon className="w-8 h-8 text-gray-400" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">
                  {file.file_name.split("/").pop()}
                </p>
                <a
                  href={file.presigned_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Ver Arquivo
                </a>
              </div>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyLink(file.presigned_url, file.file_name)
                        }
                      >
                        {copiedStates[file.file_name] ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {copiedStates[file.file_name]
                          ? "Copiado!"
                          : "Copiar Link"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteFile(file.file_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Deletar arquivo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
