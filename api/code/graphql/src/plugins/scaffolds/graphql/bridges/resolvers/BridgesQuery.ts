import { BridgeEntity } from "../types";
import { Bridges } from "../entities";
import BridgesResolver from "./BridgesResolver";

/**
 * Contains base `getBridge` and `listBridges` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement security-related checks.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api/resolvers/query
 */

interface GetBridgeParams {
    id: string;
}

interface ListBridgesParams {
    sort?: "createdOn_ASC" | "createdOn_DESC";
    limit?: number;
    after?: string;
    before?: string;
}

interface ListBridgesResponse {
    data: BridgeEntity[];
    meta: { limit: number; after: string; before: string };
}

interface BridgesQuery {
    getBridge(params: GetBridgeParams): Promise<BridgeEntity>;
    listBridges(params: ListBridgesParams): Promise<ListBridgesResponse>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class BridgesQueryResolver extends BridgesResolver implements BridgesQuery {
    /**
     * Returns a single Bridge entry from the database.
     * @param id
     */
    async getBridge({ id }: GetBridgeParams) {
        // Query the database and return the entry. If entry was not found, an error is thrown.
        const { Item: bridge } = await Bridges.get({ PK: this.getPK(), SK: id });
        if (!bridge) {
            throw new Error(`Bridge "${id}" not found.`);
        }

        return bridge;
    }

    /**
     * List multiple Bridge entries from the database.
     * Supports basic sorting and cursor-based pagination.
     * @param limit
     * @param sort
     * @param after
     * @param before
     */
    async listBridges({ limit = 10, sort, after, before }: ListBridgesParams) {
        const PK = this.getPK();
        const query = { limit, reverse: sort !== "createdOn_ASC", gt: undefined, lt: undefined };
        const meta = { limit, after: null, before: null };

        // The query is constructed differently, depending on the "before" or "after" values.
        if (before) {
            query.reverse = !query.reverse;
            if (query.reverse) {
                query.lt = before;
            } else {
                query.gt = before;
            }

            const { Items } = await Bridges.query(PK, { ...query, limit: limit + 1 });

            const data = Items.slice(0, limit).reverse();

            const hasBefore = Items.length > limit;
            if (hasBefore) {
                meta.before = Items[Items.length - 1].id;
            }

            meta.after = Items[0].id;

            return { data, meta };
        }

        if (after) {
            if (query.reverse) {
                query.lt = after;
            } else {
                query.gt = after;
            }
        }

        const { Items } = await Bridges.query(PK, { ...query, limit: limit + 1 });

        const data = Items.slice(0, limit);

        const hasAfter = Items.length > limit;
        if (hasAfter) {
            meta.after = Items[limit - 1].id;
        }

        if (after) {
            meta.before = Items[0].id;
        }

        return { data, meta };
    }
}
