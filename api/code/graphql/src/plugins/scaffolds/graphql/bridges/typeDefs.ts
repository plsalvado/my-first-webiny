export default /* GraphQL */ `
    type Bridge {
        id: ID!
        title: String!
        description: String
        createdOn: DateTime!
        savedOn: DateTime!
        createdBy: BridgeCreatedBy
    }

    type BridgeCreatedBy {
        id: String!
        type: String!
        displayName: String!
    }

    input BridgeCreateInput {
        title: String!
        description: String
    }

    input BridgeUpdateInput {
        title: String
        description: String
    }

    type BridgesListMeta {
        limit: Number
        before: String
        after: String
    }

    enum BridgesListSort {
        createdOn_ASC
        createdOn_DESC
    }

    type BridgesList {
        data: [Bridge]
        meta: BridgesListMeta
    }

    type BridgeQuery {
        getBridge(id: ID!): Bridge
        listBridges(limit: Int, before: String, after: String, sort: BridgesListSort): BridgesList!
    }

    type BridgeMutation {
        # Creates and returns a new Bridge entry.
        createBridge(data: BridgeCreateInput!): Bridge!

        # Updates and returns an existing Bridge entry.
        updateBridge(id: ID!, data: BridgeUpdateInput!): Bridge!

        # Deletes and returns an existing Bridge entry.
        deleteBridge(id: ID!): Bridge!
    }

    extend type Query {
        bridges: BridgeQuery
    }

    extend type Mutation {
        bridges: BridgeMutation
    }
`;
