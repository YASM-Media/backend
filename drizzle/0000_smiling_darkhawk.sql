CREATE TABLE "authentication_info" (
	"keycloak_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authentication_info_keycloak_id_unique" UNIQUE("keycloak_id")
);
--> statement-breakpoint
CREATE TABLE "user_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"keycloak_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_keycloak_id_authentication_info_keycloak_id_fk" FOREIGN KEY ("keycloak_id") REFERENCES "public"."authentication_info"("keycloak_id") ON DELETE no action ON UPDATE no action;