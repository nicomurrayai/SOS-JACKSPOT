import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    leads: defineTable({
        email: v.string(),
        isWinner: v.optional(v.boolean()),
        prize: v.optional(v.union(v.string() , v.null())),
    })
});