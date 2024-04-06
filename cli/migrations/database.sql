CREATE TABLE "public"."wikis" (
    "id" uuid NOT NULL,
    "user_id" uuid,
    "title" varchar,
    "description" text,
    "sidebar" jsonb,
    PRIMARY KEY ("id")
);
CREATE TABLE "public"."users" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar,
    "email" varchar,
    "firebase_id" varchar,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamptz,
    "username" varchar,
    PRIMARY KEY ("id")
);
CREATE TABLE "public"."tags" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "name" varchar,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
CREATE TABLE "public"."feeds" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "content" jsonb,
    "expired_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
CREATE TABLE "public"."clips" (
    "id" uuid,
    "url" varchar,
    "title" varchar,
    "hash_url" varchar,
    "description" text,
    "content" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp,
    "hostname" varchar,
    "user_id" uuid,
    "summary" text DEFAULT ''::text
);
CREATE TABLE "public"."tags" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "name" varchar,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
CREATE TABLE "public"."clip_tags" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "tag_id" uuid,
    "clip_id" uuid,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);