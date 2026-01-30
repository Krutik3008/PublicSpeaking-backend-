const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Enable CORS - allow frontend domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL // Add your Vercel frontend URL in .env
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scenarios', require('./routes/scenarioRoutes'));
app.use('/api/scripts', require('./routes/scriptRoutes'));
app.use('/api/tips', require('./routes/tipRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/tools', require('./routes/toolsRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to SpeakUp Confidence API',
        description: 'Helping people speak up without fear in public situations',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            scenarios: '/api/scenarios',
            scripts: '/api/scripts',
            tips: '/api/tips',
            stories: '/api/stories'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🎤 SpeakUp Confidence API                              ║
  ║   Helping people speak up without fear                   ║
  ║                                                           ║
  ║   Server running on port ${PORT}                            ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});
