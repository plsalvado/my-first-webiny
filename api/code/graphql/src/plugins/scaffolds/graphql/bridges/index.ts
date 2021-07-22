import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/plugins/GraphQLSchemaPlugin";
import { BridgesContext } from "./types";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

/**
 * We expand the existing schema of our GraphQL server via the `GraphQLSchemaPlugin` plugin.
 * The two main properties it contains are the `typeDefs` and `resolvers`, which, respectively,
 * define how we want to expand the existing GraphQL schema and the resolver functions.
 * To learn more, open the imported `typeDefs` and `resolvers` files.
 */
export default new GraphQLSchemaPlugin<BridgesContext>({
    typeDefs,
    resolvers: {
        Query: {
            bridges: (_, __, context) => {
                return new resolvers.BridgesQuery(context);
            }
        },
        Mutation: {
            bridges: (_, __, context) => {
                return new resolvers.BridgesMutation(context);
            }
        }
    }
});
