import { createApp } from './app';

const PORT = Number(process.env.PORT) || 4000;
const { httpServer } = createApp();

httpServer.listen(PORT, () => {
  console.log(`MediAlert API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
