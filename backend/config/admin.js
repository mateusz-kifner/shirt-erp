module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8a4e137bafaf102c5f4af03dfe597e1f'),
  },
});
