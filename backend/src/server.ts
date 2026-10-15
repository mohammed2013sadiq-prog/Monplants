require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, seedInitialData } = require('./models');

const authRoutes = require('./routes/auth.routes');
const speciesRoutes = require('./routes/species.routes');
const plantRoutes = require('./routes/plants.routes');
const favoriteRoutes = require('./routes/favorites.routes');
const reminderRoutes = require('./routes/reminders.routes');
const journalRoutes = require('./routes/journal.routes');
const aiRoutes = require('./routes/ai.routes');

const errorMiddleware = require('./middlewares/error.middleware');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MoPlants API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected successfully.');
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');

    await seedInitialData();
  } catch (error: any) {
    console.error('Database connection notice:', error.message);
    console.log('Server is continuing to run. Ensure PostgreSQL database "moplants" is created.');
  }

  app.listen(PORT, () => {
    console.log(`MoPlants backend server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/`);
  });
};

startServer();

module.exports = app;
