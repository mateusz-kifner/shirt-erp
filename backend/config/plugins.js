module.exports = ({ env }) => ({
  transformer: {
    enabled: true,
    config: {
      prefix: "/api/",
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::order.order",
          modelName: "order",
          queryConstraints: {
            where: {
              $and: [
                {
                  name: { $notNull: true },
                },
              ],
            },
          },
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -600,
            limit: 10,
            keys: [
              {
                name: "name",
                weight: 100,
              },
            ],
          },
        },
      ],
    },
  },
});
