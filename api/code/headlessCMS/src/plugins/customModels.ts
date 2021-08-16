import { ContentModelPlugin } from "@webiny/api-headless-cms/content/plugins/ContentModelPlugin";
import { ContentModelGroupPlugin } from "@webiny/api-headless-cms/content/plugins/ContentModelGroupPlugin";

export default [
    new ContentModelGroupPlugin({
        id: "ecommerce",
        name: "E-Commerce",
        slug: "e-commmerce",
        icon: "fas/shopping-cart"
    }),
    new ContentModelPlugin({
        name: "Product",
        modelId: "product",
        group: {
            id: "ecommerce",
            name: "E-Commerce"
        },
        fields: [
            {
                id: "name",
                fieldId: "name",
                type: "text",
                label: "Product Name",
                helpText: "A short product name",
                renderer: { name: "text-input" },
                validation: [
                    {
                        name: "required",
                        message: "Value is required."
                    }
                ]
            },
            {
                id: "sku",
                fieldId: "sku",
                type: "text",
                label: "SKU",
                placeholderText: "SKU = Stock Keeping Unit",
                renderer: { name: "text-input" }
            },
            {
                id: "price",
                fieldId: "price",
                type: "number",
                label: "Price",
                renderer: { name: "text-input" }
            }
        ],
        layout: [["name"], ["sku", "price"]],
        titleFieldId: "name"
    })
];