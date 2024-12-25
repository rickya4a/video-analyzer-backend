import express from 'express';
import { ThumbnailService } from '../services/thumbnailService';

const router = express.Router();
const thumbnailService = new ThumbnailService();

router.get('/', async (req: any, res: any) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  try {
    const thumbnailPath = await thumbnailService.generateThumbnail(url);
    res.sendFile(thumbnailPath);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Error generating thumbnail' });
  }
});

export const thumbnailRouter = router;

