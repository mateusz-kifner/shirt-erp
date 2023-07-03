module.exports = ({ env }) => ({
  upload: {
    config: {
      sizeLimit: 4 * 1024 * 1024 * 1024, // 4GB
    },
  },

  transformer: {
    enabled: true,
    config: {
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
        {
          uid: "api::client.client",
          modelName: "client",
          queryConstraints: {
            where: {
              $and: [
                {
                  username: { $notNull: true },
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
                name: "username",
                weight: 100,
              },
              {
                name: "firstname",
                weight: 100,
              },
              {
                name: "lastname",
                weight: 100,
              },
              {
                name: "email",
                weight: 100,
              },
              {
                name: "companyName",
                weight: 100,
              },
            ],
          },
        },
        {
          uid: "api::product.product",
          modelName: "product",
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
