const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGO } = require('./config/config.js');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typedef.js');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
});

mongoose
	.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB connected!');
		return server.listen({ port: 5000 });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	});
