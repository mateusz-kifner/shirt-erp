ALTER TABLE "clients" RENAME TO "customers";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "client_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "orders_to_email_messages" RENAME COLUMN "email_messages_id" TO "email_message_id";--> statement-breakpoint
ALTER TABLE "email_messages" DROP CONSTRAINT "email_messages_message_file_id_files_id_fk";
--> statement-breakpoint
ALTER TABLE "spreadsheets" DROP CONSTRAINT "spreadsheets_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_client_id_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "email_messages_to_files" DROP CONSTRAINT "email_messages_to_files_email_messages_id_email_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "email_credentials_to_users" DROP CONSTRAINT "email_credentials_to_users_email_credentials_id_email_credentia";
--> statement-breakpoint
ALTER TABLE "email_credentials_to_users" DROP CONSTRAINT "email_credentials_to_users_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_email_messages" DROP CONSTRAINT "orders_to_email_messages_email_messages_id_email_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_email_messages" DROP CONSTRAINT "orders_to_email_messages_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_files" DROP CONSTRAINT "orders_to_files_file_id_files_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_products" DROP CONSTRAINT "orders_to_products_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_users" DROP CONSTRAINT "orders_to_users_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "clients_address_id_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_email_messages" DROP CONSTRAINT "orders_to_email_messages_order_id_email_messages_id_pk";--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "street_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "street_number" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "apartment_number" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "second_line" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "post_code" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "city" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "province" SET DEFAULT 'pomorskie';--> statement-breakpoint
ALTER TABLE "email_messages" ALTER COLUMN "date" SET DATA TYPE timestamp (6);--> statement-breakpoint
ALTER TABLE "email_messages" ALTER COLUMN "header_lines" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "email_credentials" ALTER COLUMN "host" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "email_credentials" ALTER COLUMN "port" SET DEFAULT 993;--> statement-breakpoint
ALTER TABLE "email_credentials" ALTER COLUMN "user" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "email_credentials" ALTER COLUMN "protocol" SET DEFAULT 'imap';--> statement-breakpoint
ALTER TABLE "email_credentials" ALTER COLUMN "password" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "cost" SET DEFAULT '0'::int;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "colors" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sizes" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unit_price" SET DEFAULT '0'::int;--> statement-breakpoint
ALTER TABLE "global_properties" ALTER COLUMN "category" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "global_properties" ALTER COLUMN "data" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'planned';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "notes" SET DEFAULT '<p></p>';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "price" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "workstation_type" SET DEFAULT 'not_set';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "pickup_method" SET DEFAULT 'not_set';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "settlement" SET DEFAULT 'not_set';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "username" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "firstname" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "lastname" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "email" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "phone_number" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "company_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders_to_email_messages" ADD CONSTRAINT "orders_to_email_messages_order_id_email_message_id_pk" PRIMARY KEY("order_id","email_message_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_message_file_id_files_id_fk" FOREIGN KEY ("message_file_id") REFERENCES "files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spreadsheets" ADD CONSTRAINT "spreadsheets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages_to_files" ADD CONSTRAINT "email_messages_to_files_email_messages_id_email_messages_id_fk" FOREIGN KEY ("email_messages_id") REFERENCES "email_messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_credentials_to_users" ADD CONSTRAINT "email_credentials_to_users_email_credentials_id_email_credentials_id_fk" FOREIGN KEY ("email_credentials_id") REFERENCES "email_credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_credentials_to_users" ADD CONSTRAINT "email_credentials_to_users_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_email_messages" ADD CONSTRAINT "orders_to_email_messages_email_message_id_email_messages_id_fk" FOREIGN KEY ("email_message_id") REFERENCES "email_messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_email_messages" ADD CONSTRAINT "orders_to_email_messages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_files" ADD CONSTRAINT "orders_to_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_users" ADD CONSTRAINT "orders_to_users_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
