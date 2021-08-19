import { createHandler } from "@webiny/handler-aws";
import elasticSearch from "@webiny/api-elasticsearch";
import dynamoDBToElastic from "@webiny/api-dynamodb-to-elasticsearch/handler";
import elasticsearchDataGzipCompression from "@webiny/api-elasticsearch/plugins/GzipCompression";

export const handler = createHandler({
    plugins: [
        elasticSearch({ endpoint: `https://${process.env.ELASTIC_SEARCH_ENDPOINT}` }),
        dynamoDBToElastic(),
        elasticsearchDataGzipCompression(),
    ],
});
