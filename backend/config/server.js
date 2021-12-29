module.exports = ({ env }) => {
  if (env('ADMIN_JWT_SECRET') === undefined || env('ADMIN_JWT_SECRET').length < 30){
    console.log("ADMIN_JWT_SECRET env must be set with minimal lenght of 30")
    process.exit(2)
}
  return({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
  cors: {
    enabled: true,
    origin: ['*']
  },
})};
