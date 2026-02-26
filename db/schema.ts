import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: text("role").default("user").notNull(),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const posts = pgTable("post", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    content_html: text("content_html").notNull(),
    content_text: text("content_text").notNull(),
    author_id: text("author_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    published_at: timestamp("published_at", { mode: "date" }),
    banner_image: text("banner_image"),
    views: integer("views").notNull().default(0),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const comments = pgTable("comment", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    post_id: text("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "cascade" }),
    user_id: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    parent_id: text("parent_id"),
    content: text("content").notNull(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const claps = pgTable("clap", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    post_id: text("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "cascade" }),
    user_id: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    count: integer("count").notNull().default(1),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// ─── Digital Products ────────────────────────────────────

export const digitalProducts = pgTable("digital_product", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    description_html: text("description_html").notNull().default(""),
    description_text: text("description_text").notNull().default(""),
    banner_image: text("banner_image"),
    price: integer("price").notNull(), // in paise (₹99 = 9900)
    file_url: text("file_url").notNull(), // Google Drive or any download link
    is_active: boolean("is_active").notNull().default(true),
    created_by: text("created_by")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const productOrders = pgTable("product_order", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    product_id: text("product_id")
        .notNull()
        .references(() => digitalProducts.id, { onDelete: "cascade" }),
    buyer_email: text("buyer_email").notNull(),
    buyer_name: text("buyer_name"),
    cf_order_id: text("cf_order_id").unique().notNull(),
    cf_payment_id: text("cf_payment_id"),
    status: text("status").notNull().default("pending"), // "pending" | "paid"
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})
