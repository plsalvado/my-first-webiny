import { BridgeEntity } from "../types";
import mdbid from "mdbid";
import { Bridges } from "../entities";
import BridgesResolver from "./BridgesResolver";

/**
 * Contains base `createBridge`, `updateBridge`, and `deleteBridge` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement custom data validation and security-related checks.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api/resolvers/mutation
 */

interface CreateBridgeParams {
    data: {
        title: string;
        description?: string;
    };
}

interface UpdateBridgeParams {
    id: string;
    data: {
        title: string;
        description?: string;
    };
}

interface DeleteBridgeParams {
    id: string;
}

interface BridgesMutation {
    createBridge(params: CreateBridgeParams): Promise<BridgeEntity>;
    updateBridge(params: UpdateBridgeParams): Promise<BridgeEntity>;
    deleteBridge(params: DeleteBridgeParams): Promise<BridgeEntity>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class BridgesMutationResolver extends BridgesResolver implements BridgesMutation {
    /**
     * Creates and returns a new Bridge entry.
     * @param data
     */
    async createBridge({ data }: CreateBridgeParams) {
        const { security } = this.context;

        // We use `mdbid` (https://www.npmjs.com/package/mdbid) library to generate
        // a random, unique, and sequential (sortable) ID for our new entry.
        const id = mdbid();

        const identity = await security.getIdentity();
        const bridge = {
            PK: this.getPK(),
            SK: id,
            id,
            title: data.title,
            description: data.description,
            createdOn: new Date().toISOString(),
            savedOn: new Date().toISOString(),
            createdBy: identity && {
                id: identity.id,
                type: identity.type,
                displayName: identity.displayName
            },
            webinyVersion: process.env.WEBINY_VERSION
        };

        // Will throw an error if something goes wrong.
        await Bridges.put(bridge);

        return bridge;
    }

    /**
     * Updates and returns an existing Bridge entry.
     * @param id
     * @param data
     */
    async updateBridge({ id, data }: UpdateBridgeParams) {
        // If entry is not found, we throw an error.
        const { Item: bridge } = await Bridges.get({ PK: this.getPK(), SK: id });
        if (!bridge) {
            throw new Error(`Bridge "${id}" not found.`);
        }

        const updatedBridge = { ...bridge, ...data };

        // Will throw an error if something goes wrong.
        await Bridges.update(updatedBridge);

        return updatedBridge;
    }

    /**
     * Deletes and returns an existing Bridge entry.
     * @param id
     */
    async deleteBridge({ id }: DeleteBridgeParams) {
        // If entry is not found, we throw an error.
        const { Item: bridge } = await Bridges.get({ PK: this.getPK(), SK: id });
        if (!bridge) {
            throw new Error(`Bridge "${id}" not found.`);
        }

        // Will throw an error if something goes wrong.
        await Bridges.delete(bridge);

        return bridge;
    }
}
