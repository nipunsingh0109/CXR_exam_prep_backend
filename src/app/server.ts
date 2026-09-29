import { app } from './app';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Handle graceful shutdown
const shutdown = () => {
  logger.info('Shutting down server gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
