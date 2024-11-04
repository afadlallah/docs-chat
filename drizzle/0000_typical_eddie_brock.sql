CREATE TABLE IF NOT EXISTS "Chat" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"messages" json NOT NULL,
	"author" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Chunk" (
	"id" text PRIMARY KEY NOT NULL,
	"filePath" text NOT NULL,
	"content" text NOT NULL,
	"embedding" real[] NOT NULL
);
