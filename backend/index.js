import express from 'express'
import http from 'http'
import serverConnection from './config/serverConnection.js';
import mongoDBConnect from './config/dbConnection.js';
import expressConfig from './middlewares/expressMiddlewares.js'
import routes from './routes/index.js'
import { fileURLToPath } from 'url';
import path,{dirname} from 'path'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const app = express();
const server = http.createServer(app)

// Middleware configuration
expressConfig(app)

// Routes Configurations
routes(app)

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connecting the Atlas database
mongoDBConnect()

// Starting the server
serverConnection(server)