import {
    GET_BRIDGE,
    CREATE_BRIDGE,
    DELETE_BRIDGE,
    LIST_BRIDGES,
    UPDATE_BRIDGE
} from "./graphql/bridges";
import { request } from "graphql-request";

/**
 * An example of an end-to-end (E2E) test. You can use these to test if the overall cloud infrastructure
 * setup is working. That's why, here we're not executing the handler code directly, but issuing real
 * HTTP requests over to the deployed Amazon Cloudfront distribution. These tests provide the highest
 * level of confidence that our application is working, but they take more time in order to complete.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api/testing/e2e
 */

const query = async ({ query = "", variables = {} } = {}) => {
    return request(process.env.API_URL + "/graphql", query, variables);
};

let testBridges = [];

describe("Bridges CRUD tests (end-to-end)", () => {
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
                }).then(response => response.bridges.createBridge)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await query({
                    query: DELETE_BRIDGE,
                    variables: {
                        id: testBridges[i].id
                    }
                });
            } catch {
                // Some of the entries might've been deleted during runtime.
                // We can ignore thrown errors.
            }
        }
        testBridges = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have bridges created, let's see if they come up in a basic listBridges query.
        const [bridge0, bridge1, bridge2] = testBridges;

        await query({
            query: LIST_BRIDGES,
            variables: { limit: 3 }
        }).then(response =>
            expect(response.bridges.listBridges).toMatchObject({
                data: [bridge2, bridge1, bridge0],
                meta: {
                    limit: 3
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
            query: LIST_BRIDGES,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.bridges.listBridges).toMatchObject({
                data: [bridge2, bridge0],
                meta: {
                    limit: 2
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
            expect(response.bridges.updateBridge).toEqual({
                id: bridge0.id,
                title: "Bridge 0 - UPDATED",
                description: `Bridge 0's description - UPDATED.`
            })
        );

        // 4. Get bridge 0 after the update.
        await query({
            query: GET_BRIDGE,
            variables: {
                id: bridge0.id
            }
        }).then(response =>
            expect(response.bridges.getBridge).toEqual({
                id: bridge0.id,
                title: "Bridge 0 - UPDATED",
                description: `Bridge 0's description - UPDATED.`
            })
        );
    });
});
