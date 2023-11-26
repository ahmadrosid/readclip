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

CREATE TABLE "public"."wikis" (
    "id" uuid NOT NULL,
    "user_id" uuid,
    "title" varchar,
    "description" text,
    "sidebar" jsonb,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."pages" (
    "id" uuid NOT NULL,
    "wiki_id" uuid,
    "title" varchar,
    "body" text,
    CONSTRAINT "fk_wikis_pages" FOREIGN KEY ("wiki_id") REFERENCES "public"."wikis"("id"),
    PRIMARY KEY ("id")
);
