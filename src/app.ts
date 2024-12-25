import express from 'express';
import cors from 'cors';
import { thumbnailRouter } from './routes/thumbnail';
import { metadataRouter } from './routes/metadata';
import { downloadRouter } from './routes/download';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/thumbnail', thumbnailRouter);
app.use('/api/metadata', metadataRouter);
app.use('/api/download', downloadRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
