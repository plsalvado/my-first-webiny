import { handler } from "~/index";
import {
    GET_BRIDGE,
    CREATE_BRIDGE,
    DELETE_BRIDGE,
    LIST_BRIDGES,
    UPDATE_BRIDGE
} from "./graphql/bridges";

/**
 * An example of an integration test. You can use these to test your GraphQL resolvers, for example,
 * ensure they are correctly interacting with the database and other cloud infrastructure resources
 * and services. These tests provide a good level of confidence that our application is working, and
 * can be reasonably fast to complete.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api/testing/integration
 */

const query = ({ query = "", variables = {} } = {}) => {
    return handler({
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({
            query,
            variables
        })
    }).then(response => JSON.parse(response.body));
};

let testBridges = [];

describe("Bridges CRUD tests (integration)", () => {
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            testBridges.push(
                await query({
                    query: CREATE_BRIDGE,
                    variables: {
                        data: {
                            title: `Bridge ${i}`,
                            description: `Bridge ${i}'s description.`
                        }
                    }
                }).then(response => response.data.bridges.createBridge)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            await query({
                query: DELETE_BRIDGE,
                variables: {
                    id: testBridges[i].id
                }
            });
        }
        testBridges = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have bridges created, let's see if they come up in a basic listBridges query.
        const [bridge0, bridge1, bridge2] = testBridges;

        await query({ query: LIST_BRIDGES }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge2, bridge1, bridge0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 2. Delete bridge 1.
        await query({
            query: DELETE_BRIDGE,
            variables: {
                id: bridge1.id
            }
        });

        await query({
            query: LIST_BRIDGES
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge2, bridge0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 3. Update bridge 0.
        await query({
            query: UPDATE_BRIDGE,
            variables: {
                id: bridge0.id,
                data: {
                    title: "Bridge 0 - UPDATED",
                    description: `Bridge 0's description - UPDATED.`
                }
            }
        }).then(response =>
            expect(response.data.bridges.updateBridge).toEqual({
                id: bridge0.id,
                title: "Bridge 0 - UPDATED",
                description: `Bridge 0's description - UPDATED.`
            })
        );

        // 5. Get bridge 0 after the update.
        await query({
            query: GET_BRIDGE,
            variables: { id: bridge0.id }
        }).then(response =>
            expect(response.data.bridges.getBridge).toEqual({
                id: bridge0.id,
                title: "Bridge 0 - UPDATED",
                description: `Bridge 0's description - UPDATED.`
            })
        );
    });

    test("should be able to use cursor-based pagination (desc)", async () => {
        const [bridge0, bridge1, bridge2] = testBridges;

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge2, bridge1],
                meta: {
                    after: bridge1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2,
                after: bridge1.id
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge0],
                meta: {
                    before: bridge0.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2,
                before: bridge0.id
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge2, bridge1],
                meta: {
                    after: bridge1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });

    test("should be able to use cursor-based pagination (ascending)", async () => {
        const [bridge0, bridge1, bridge2] = testBridges;

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2,
                sort: "createdOn_ASC"
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge0, bridge1],
                meta: {
                    after: bridge1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                after: bridge1.id
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge2],
                meta: {
                    before: bridge2.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_BRIDGES,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                before: bridge2.id
            }
        }).then(response =>
            expect(response.data.bridges.listBridges).toEqual({
                data: [bridge0, bridge1],
                meta: {
                    after: bridge1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });
});
