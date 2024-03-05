import { db, games as gamesTable } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { publicProcedure } from "../trpc";

export const games = publicProcedure.query(async () => {
  return db.query.games.findMany({
    where: eq(gamesTable.active, true),
    orderBy: asc(gamesTable.name),
  });
});
