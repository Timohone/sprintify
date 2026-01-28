require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const SyncScheduler = require('./services/SyncScheduler');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: false });
    logger.info('Database tables synced');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Start sync scheduler in production
    if (process.env.NODE_ENV === 'production') {
      await SyncScheduler.start({ syncOnStart: false });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  SyncScheduler.stop();
  await sequelize.close();
  process.exit(0);
});
