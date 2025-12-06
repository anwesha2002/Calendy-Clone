import {integer, pgTable, text, uuid, timestamp, boolean, index} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow()
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date())

export const EventTable = pgTable("events", {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        description: text("description"),
        durationInMinutes: integer("durationInMinutes").notNull(),
        clerkUserId: text("clerkUserId").notNull(),
        isActive: boolean("isActive").notNull().default(true),
        createdAt,
        updatedAt
    },
    (table) => [
      t.index("clerkUserIdIndex").on(table.clerkUserId)
    ]
);

export const ScheduleTable = pgTable("schedules", {
  id : uuid("id").primaryKey().defaultRandom(),
  clerkUserId : text("clerkUserId").notNull().unique(),
  Timezone : text("Timezone").notNull(),
  createdAt,
  updatedAt
})


export const scheduleAvailabilitiesTable = pgTable("scheduleAvailabilities", {
    id : uuid("id").primaryKey().defaultRandom(),
    scheduleId : uuid("scheduleId").notNull().references(() => ScheduleTable.id),
    dayOfWeek : integer("dayOfWeek").notNull(), // 0 (Sunday) to 6 (Saturday)
    startTime : text("startTime").notNull(), // "09:00"
    endTime : text("endTime").notNull(),   // "17:00"
    createdAt,
    updatedAt
},
    (table) => [
      index("scheduleIdIndex").on(table.scheduleId)
    ]
);



