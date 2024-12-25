import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';
import { createHash } from 'crypto';

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);

export class ThumbnailService {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(__dirname, '..', '..', 'cache');
    this.ensureCacheDir();
  }

  private async ensureCacheDir() {
    try {
      await mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating cache directory:', error);
    }
  }

  private getCacheKey(url: string): string {
    return createHash('md5').update(url).digest('hex');
  }

  async generateThumbnail(url: string): Promise<string> {
    const cacheKey = this.getCacheKey(url);
    const cachedPath = path.resolve(this.cacheDir, `${cacheKey}.gif`);
    const tempPath = path.resolve(this.cacheDir, `${cacheKey}_temp.gif`);

    try {
      // Ensure the cache directory exists
      await this.ensureCacheDir();

      // Check if the thumbnail already exists
      try {
        await readFile(cachedPath);
        return cachedPath;
      } catch (error) {
        console.log('File doesn\'t exist, continuing with generation');
      }

      // Generate the thumbnail
      return new Promise((resolve, reject) => {
        ffmpeg(url)
          .on('start', (commandLine) => {
            console.log('FFmpeg starting:', commandLine);
          })
          .on('end', async () => {
            try {
              // Check if the temp file was created
              if (fs.existsSync(tempPath)) {
                // Rename temp file to final file
                await promisify(fs.rename)(tempPath, cachedPath);
                resolve(cachedPath);
              } else {
                reject(new Error('Output file was not created'));
              }
            } catch (err) {
              console.error('Error finalizing thumbnail:', err);
              reject(err);
            }
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            // Clean up temp file if it exists
            if (fs.existsSync(tempPath)) {
              fs.unlinkSync(tempPath);
            }
            reject(err);
          })
          .outputOptions([
            '-y',
            '-vf', 'fps=1/2,scale=320:-1',
            '-frames:v', '8'
          ])
          .save(tempPath);
      });
    } catch (error) {
      console.error('Thumbnail generation error:', {
        error,
        cacheDir: this.cacheDir,
        outputPath: cachedPath
      });
      // Clean up any temporary files
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw error;
    }
  }
}

