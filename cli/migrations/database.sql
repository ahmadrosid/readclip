CREATE TABLE "public"."articles" (
    "id" uuid,
    "url" varchar,
    "title" varchar,
    "hash_url" varchar,
    "description" text,
    "content" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp,
    "hostname" varchar
);

CREATE TABLE "public"."article_tags" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "tag_id" uuid,
    "article_id" uuid,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
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