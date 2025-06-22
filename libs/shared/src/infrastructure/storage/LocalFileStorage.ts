import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { FileStorage } from '@app/shared/domain/storage/FileStorage';

export class LocalFileStorage implements FileStorage {
  private UPLOAD_FOLDER = 'uploads';
  private FILE_PATH: string;

  constructor() {
    const baseTmpPath = os.tmpdir();
    this.FILE_PATH = path.join(baseTmpPath, this.UPLOAD_FOLDER);

    if (!fs.existsSync(this.FILE_PATH)) {
      fs.mkdirSync(this.FILE_PATH);
    }
  }

  upload(fileContent: string, pathFile: string): string {
    const filePath = path.join(this.FILE_PATH, pathFile);

    fs.writeFileSync(filePath, Buffer.from(fileContent, 'base64'));

    return `/${this.UPLOAD_FOLDER}/${pathFile}`;
  }
}
