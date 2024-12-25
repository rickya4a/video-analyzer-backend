import ffmpeg from 'fluent-ffmpeg';

interface VideoMetadata {
  duration: string;
  resolution: string;
  codec: string;
  bitrate: string;
  frameRate: string;
}

export class MetadataService {
  async extractMetadata(url: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(url, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        // Find the video stream
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        if (!videoStream) {
          reject(new Error('No video stream found'));
          return;
        }

        // Extract metadata
        resolve({
          duration: metadata.format.duration ? `${metadata.format.duration} seconds` : 'Unknown',
          resolution: videoStream.width && videoStream.height ? `${videoStream.width}x${videoStream.height}` : 'Unknown',
          codec: videoStream.codec_name || 'Unknown',
          bitrate: metadata.format.bit_rate ? `${Math.round(parseInt(metadata.format.bit_rate as any) / 1000)} kbps` : 'Unknown',
          frameRate: videoStream.avg_frame_rate || 'Unknown',
        });
      });
    });
  }
}