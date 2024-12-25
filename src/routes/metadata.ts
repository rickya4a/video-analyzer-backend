import express from 'express';
import { MetadataService } from '../services/metadataService';

const router = express.Router();
const metadataService = new MetadataService();

router.get('/', async (req: any, res: any) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  try {
    const metadata = await metadataService.extractMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error('Error extracting metadata:', error);
    res.status(500).json({ error: 'Error extracting metadata' });
  }
});

export const metadataRouter = router;

