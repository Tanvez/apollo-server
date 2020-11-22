const { ApolloServer, gql } = require("apollo-server");
const { User, ShortUrl } = require("./models");
const slugify = require("slugify");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
	type Query {
		hello: String
		shortUrl(slug: String!): ShortUrl!
	}

	type Mutation {
		createShortUrl(slug: String!, url: String!): ShortUrl!
	}

	type ShortUrl {
		id: ID!
		url: String!
		slug: String!
	}
`;

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: (root, args, context) => "Hello world!",
		shortUrl: async (_, { slug }) => {
			const result = await ShortUrl.findOne({ where: { slug } });
			return result;
		},
	},

	Mutation: {
		createShortUrl: async (_, { slug, url }) => {
			const result = await ShortUrl.create({
				slug: slugify(slug),
				url,
			});
			return result;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
