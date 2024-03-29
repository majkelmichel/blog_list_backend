const config = require('./utils/config');
const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})
	.then(() => {
		logger.info('connected');
	})
	.catch(err => {
		logger.error('failed to connect:', err.message);
	});

app.use(cors());
// app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.get("/", (req, res) => {
	res.send("Hello");
})

if (process.env.NODE_ENV === 'testing') {
	const testingRouter = require('./controllers/test');
	app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;