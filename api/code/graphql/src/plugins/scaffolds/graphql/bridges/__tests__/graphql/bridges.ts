/**
 * Contains all of the GraphQL queries and mutations that we might need while writing our tests.
 * If needed, feel free to add more.
 */

export const GET_BRIDGE = /* GraphQL */ `
    query GetBridge($id: ID!) {
        bridges {
            getBridge(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const CREATE_BRIDGE = /* GraphQL */ `
    mutation CreateBridge($data: BridgeCreateInput!) {
        bridges {
            createBridge(data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_BRIDGE = /* GraphQL*/ `
    mutation UpdateBridge($id: ID!, $data: BridgeUpdateInput!) {
        bridges {
            updateBridge(id: $id, data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const DELETE_BRIDGE = /* GraphQL */ `
    mutation DeleteBridge($id: ID!) {
        bridges {
            deleteBridge(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const LIST_BRIDGES = /* GraphQL */ `
    query ListBridges($sort: BridgesListSort, $limit: Int, $after: String) {
        bridges {
            listBridges(sort: $sort, limit: $limit, after: $after) {
                data {
                    id
                    title
                    description
                }
                meta {
                    limit
                    after
                    before
                }
            }
        }
    }
`;
