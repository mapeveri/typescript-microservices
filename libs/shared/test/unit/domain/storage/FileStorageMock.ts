import { FileStorage } from '@app/shared/domain/storage/FileStorage';

export class FileStorageMock implements FileStorage {
  private toReturn: string[] = [];

  constructor() {
    this.toReturn = [];
  }

  add(file: string): void {
    this.toReturn.push(file);
  }

  clean(): void {
    this.toReturn = [];
  }

  upload(_fileContent: string, _pathFile: string): string {
    return this.toReturn[0];
  }
}
