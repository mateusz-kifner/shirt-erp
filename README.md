![ShirtERP](/.github/logo.png)

# ShirtERP

System do zażądania drukarnią koszulek.

#### obrazy

![Produkty](.github/ShirtERP.png)
![Zamówienia](.github/ShirtERP2.png)

### License Proprietary

All licenses for ShirtDipERP carries out to ShirtERP, with the same terms.

### For commercial deals please contact me via mail: kifner.mateusz(αt)gmail.com

## Installation instructions

1. Install and configure postgresql v13.
2. Install node 16, yarn, git
3. Git clone this repository and select tag of version you want to use from master branch.
4. Run `yarn` in cloned folder to install dependencies, then run `yarn build` to build application UI.
5. Set env variables in .env file

   - In frontend specify server url

   ```
   SERVER_URL=http://api.shirterp.ct8.pl:1337
   ```

   - In backend specify, JWT Secret for strapi and application

   ```
   ADMIN_JWT_SECRET=secret_must_be_secure_and_random
   JWT_SECRET=secret_must_be_secure_and_random
   ```

   - In backend specify database credentials for postgresql v13 database

   ```
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_NAME=shirt
   DATABASE_USERNAME=shirt
   DATABASE_PASSWORD=shirt
   DATABASE_SSL=false
   ```

6. Server is now ready and can be started with `yarn prod` command

ShirtERP is Copyright (c) Mateusz Kifner kifner.mateusz(αt)gmail.com
