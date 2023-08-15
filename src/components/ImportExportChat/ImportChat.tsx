import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import useStore from "@store/store";

import {
  isLegacyImport,
  validateAndFixChats,
  validateExportV1,
} from "@utils/import";

import { ChatInterface, Folder, FolderCollection } from "@type/chat";
import { ExportBase } from "@type/export";

const ImportChat = () => {
  const { t } = useTranslation();
  const setChats = useStore.getState().setChats;
  const setFolders = useStore.getState().setFolders;
  const inputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<
    {
      message: string;
      success: boolean;
    } | null
  >(null);

  const handleFileUpload = () => {
    if (!inputRef || !inputRef.current) return;
    const file = inputRef.current.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target?.result as string;

        try {
          const parsedData = JSON.parse(data);
          if (isLegacyImport(parsedData)) {
            if (validateAndFixChats(parsedData)) {
              // import new folders
              const folderNameToIdMap: Record<string, string> = {};
              const parsedFolders: string[] = [];

              parsedData.forEach((data) => {
                const folder = data.folder;
                if (folder) {
                  if (!parsedFolders.includes(folder)) {
                    parsedFolders.push(folder);
                    folderNameToIdMap[folder] = uuidv4();
                  }
                  data.folder = folderNameToIdMap[folder];
                }
              });

              const newFolders: FolderCollection = parsedFolders.reduce(
                (acc, curr, index) => {
                  const id = folderNameToIdMap[curr];
                  const _newFolder: Folder = {
                    id,
                    name: curr,
                    expanded: false,
                    order: index,
                  };
                  return { [id]: _newFolder, ...acc };
                },
                {},
              );

              // increment the order of existing folders
              const offset = parsedFolders.length;

              const updatedFolders = useStore.getState().folders;
              Object.values(updatedFolders).forEach((f) => (f.order += offset));

              setFolders({ ...newFolders, ...updatedFolders });

              // import chats
              const prevChats = useStore.getState().chats;
              if (prevChats) {
                const updatedChats: ChatInterface[] = JSON.parse(
                  JSON.stringify(prevChats),
                );
                setChats(parsedData.concat(updatedChats));
              } else {
                setChats(parsedData);
              }
              setAlert({ message: "Succesfully imported!", success: true });
            } else {
              setAlert({
                message: "Invalid chats data format",
                success: false,
              });
            }
          } else {
            switch ((parsedData as ExportBase).version) {
              case 1:
                if (validateExportV1(parsedData)) {
                  // import folders
                  parsedData.folders;
                  // increment the order of existing folders
                  const offset = Object.keys(parsedData.folders).length;

                  const updatedFolders = useStore.getState().folders;
                  Object.values(updatedFolders).forEach(
                    (f) => (f.order += offset),
                  );

                  setFolders({ ...parsedData.folders, ...updatedFolders });

                  // import chats
                  const prevChats = useStore.getState().chats;
                  if (parsedData.chats) {
                    if (prevChats) {
                      const updatedChats: ChatInterface[] = JSON.parse(
                        JSON.stringify(prevChats),
                      );
                      setChats(parsedData.chats.concat(updatedChats));
                    } else {
                      setChats(parsedData.chats);
                    }
                  }

                  setAlert({ message: "Succesfully imported!", success: true });
                } else {
                  setAlert({
                    message: "Invalid format",
                    success: false,
                  });
                }
                break;
            }
          }
        } catch (error: unknown) {
          setAlert({ message: (error as Error).message, success: false });
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <label className="block mb-2 text-sm font-medium text-custom-white">
        {t("import")} (JSON):
      </label>
      <input
        className="w-full text-sm file:p-2 text-custom-white file:text-custom-white rounded-md cursor-pointer focus:outline-none bg-neutral-light file:bg-neutral-dark file:border-0 placeholder-neutral-dark file:cursor-pointer"
        type="file"
        ref={inputRef}
      />
      <button
        className="btn btn-small btn-primary mt-3"
        onClick={handleFileUpload}
        aria-label={t("import") as string}
      >
        {t("import")}
      </button>
      {alert && (
        <div
          className={`relative py-2 px-3 w-full mt-3 border rounded-md text-neutral-base text-sm whitespace-pre-wrap ${
            alert.success
              ? "border-green-500 bg-green-500/10"
              : "border-red-500 bg-red-500/10"
          }`}
        >
          {alert.message}
        </div>
      )}
    </>
  );
};

export default ImportChat;
