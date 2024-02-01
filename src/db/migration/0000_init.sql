-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('admin', 'manager', 'employee', 'normal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"street_name" varchar(255) DEFAULT ''::character varying,
	"street_number" varchar(255) DEFAULT ''::character varying,
	"apartment_number" varchar(255) DEFAULT ''::character varying,
	"second_line" varchar(255) DEFAULT ''::character varying,
	"post_code" varchar(255) DEFAULT ''::character varying,
	"city" varchar(255) DEFAULT ''::character varying,
	"province" varchar(255) DEFAULT 'pomorskie'::character varying
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" varchar(255),
	"from" varchar(255),
	"to" varchar(255),
	"date" timestamp(6),
	"html" text,
	"text" text,
	"message_id" varchar(255),
	"message_uid" integer,
	"mailbox" varchar,
	"client_user" varchar,
	"header_lines" varchar[] DEFAULT 'RRAY[',
	"text_as_html" text,
	"message_file_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"host" varchar(255) DEFAULT ''::character varying,
	"port" integer NOT NULL,
	"user" varchar(255) DEFAULT ''::character varying,
	"protocol" varchar(255) DEFAULT 'imap'::character varying,
	"password" varchar(255) DEFAULT ''::character varying,
	"boolean" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) DEFAULT ''::character varying,
	"firstname" varchar(255) DEFAULT ''::character varying,
	"lastname" varchar(255) DEFAULT ''::character varying,
	"email" varchar(255) DEFAULT ''::character varying,
	"phone_number" varchar(255) DEFAULT ''::character varying,
	"company_name" varchar(255) DEFAULT ''::character varying,
	"notes" text DEFAULT '<p></p>',
	"address_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255),
	"is_template" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT ''::character varying,
	"cost" numeric(10, 2) DEFAULT 0,
	"expense_data" json DEFAULT '[]'::json,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255),
	"is_template" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spreadsheets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"data" json DEFAULT '[]'::json,
	"order_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"category" varchar(255) DEFAULT ''::character varying,
	"description" text DEFAULT '',
	"colors" varchar(64)[] DEFAULT ARRAY[]::character varying[],
	"sizes" varchar(255)[] DEFAULT ARRAY[]::character varying[],
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255),
	"is_template" boolean DEFAULT false,
	"unit_price" numeric(10, 2) DEFAULT 0,
	CONSTRAINT "products_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(255),
	"role" "role" DEFAULT 'normal',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" integer NOT NULL,
	"filepath" varchar(2048) NOT NULL,
	"original_filename" varchar(1024),
	"new_filename" varchar(1024),
	"filename" varchar(1024),
	"mimetype" varchar(255),
	"hash" varchar(10),
	"token" varchar(32),
	"width" integer,
	"height" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(255) DEFAULT ''::character varying NOT NULL,
	"name" varchar(255) NOT NULL,
	"data" varchar(255)[] DEFAULT ARRAY[]::character varying[],
	CONSTRAINT "global_properties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT ''::character varying,
	"status" varchar(255) DEFAULT 'planned'::character varying,
	"notes" varchar(255) DEFAULT '<p></p>'::character varying,
	"price" varchar(255) DEFAULT ''::character varying,
	"is_price_paid" boolean DEFAULT false,
	"date_of_completion" date,
	"work_time" double precision DEFAULT 0,
	"client_id" integer,
	"address_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" varchar(255),
	"updated_by_id" varchar(255),
	"is_in_warehouse" boolean DEFAULT false,
	"date_of_admission" date DEFAULT now(),
	"workstation_type" varchar(255) DEFAULT 'not_set'::character varying,
	"pickup_method" varchar(255) DEFAULT 'not_set'::character varying,
	"is_archived" boolean DEFAULT false,
	"is_template" boolean DEFAULT false,
	"is_product_ordered" boolean DEFAULT false,
	"settlement" varchar(64) DEFAULT 'not_set'::character varying
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_messages_to_files" (
	"email_messages_id" integer NOT NULL,
	"file_id" integer NOT NULL,
	CONSTRAINT "email_messages_to_files_email_messages_id_file_id_pk" PRIMARY KEY("email_messages_id","file_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_credentials_to_users" (
	"email_credentials_id" integer NOT NULL,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT "email_credentials_to_users_email_credentials_id_userId_pk" PRIMARY KEY("email_credentials_id","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_email_messages" (
	"order_id" integer NOT NULL,
	"email_messages_id" integer NOT NULL,
	CONSTRAINT "orders_to_email_messages_order_id_email_messages_id_pk" PRIMARY KEY("order_id","email_messages_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_files" (
	"order_id" integer NOT NULL,
	"file_id" integer NOT NULL,
	CONSTRAINT "orders_to_files_order_id_file_id_pk" PRIMARY KEY("order_id","file_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_products" (
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "orders_to_products_order_id_product_id_pk" PRIMARY KEY("order_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_users" (
	"order_id" integer NOT NULL,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT "orders_to_users_order_id_userId_pk" PRIMARY KEY("order_id","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_message_file_id_files_id_fk" FOREIGN KEY ("message_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spreadsheets" ADD CONSTRAINT "spreadsheets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages_to_files" ADD CONSTRAINT "email_messages_to_files_email_messages_id_email_messages_id_fk" FOREIGN KEY ("email_messages_id") REFERENCES "public"."email_messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages_to_files" ADD CONSTRAINT "email_messages_to_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_credentials_to_users" ADD CONSTRAINT "email_credentials_to_users_email_credentials_id_email_credentia" FOREIGN KEY ("email_credentials_id") REFERENCES "public"."email_credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_credentials_to_users" ADD CONSTRAINT "email_credentials_to_users_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_email_messages" ADD CONSTRAINT "orders_to_email_messages_email_messages_id_email_messages_id_fk" FOREIGN KEY ("email_messages_id") REFERENCES "public"."email_messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_email_messages" ADD CONSTRAINT "orders_to_email_messages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_files" ADD CONSTRAINT "orders_to_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_files" ADD CONSTRAINT "orders_to_files_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_users" ADD CONSTRAINT "orders_to_users_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_users" ADD CONSTRAINT "orders_to_users_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


*/