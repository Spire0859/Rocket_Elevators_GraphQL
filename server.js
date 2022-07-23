var Express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
import Schema from './schema';
// Config
var app = Express();
app.use('/graphql', graphqlHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Express GraphQL server is running");
});