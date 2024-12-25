import axios from 'axios';
import { Response } from 'express';

export class DownloadService {
  constructor() {}

  async downloadFile(url: string, res: Response): Promise<void> {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      // Set headers from the original response
      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Content-Length', response.headers['content-length']);
      res.setHeader('Content-Disposition', `attachment; filename="${this.getFilenameFromUrl(url)}"`);

      // Pipe the download stream directly to the response
      response.data.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  private getFilenameFromUrl(url: string): string {
    try {
      const urlPath = new URL(url).pathname;
      const filename = urlPath.split('/').pop();
      return filename || 'download';
    } catch {
      return 'download';
    }
  }
}
