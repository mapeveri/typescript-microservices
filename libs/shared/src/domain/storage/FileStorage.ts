export interface FileStorage {
  upload(fileContent: string, pathFile: string): string;
}

export const FILE_STORAGE = Symbol('FileStorage');
