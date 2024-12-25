import express from 'express';
import { DownloadService } from '../services/downloadService';

const router = express.Router();
const downloadService = new DownloadService();

router.get('/', async (req: any, res: any) => {
  try {
    const { url } = req.query as { url: string };

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    await downloadService.downloadFile(url, res);
  } catch (error) {
    console.error('Download route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
});

export const downloadRouter = router;
