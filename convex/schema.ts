import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    leads: defineTable({
        email: v.string(),
        isWinner: v.optional(v.boolean()),
        prize: v.optional(v.union(v.string(), v.null())),
    }),
    probabilities: defineTable({
        sos: v.optional(v.number()),
        grua: v.optional(v.number()),
        moto: v.optional(v.number()),
        moura: v.optional(v.number()),
        lusqtoff: v.optional(v.number())
    })
});