import { db, votes } from "~/packages/db/schema";
import type { AuthenticatedUser } from "../queries/users";
import { and, eq } from "drizzle-orm";

export default async function castVote(user: AuthenticatedUser) {
  const vote = await db.query.votes.findFirst({
    where: and(eq(votes.user, user.id)),
  });

  if (vote) return true;

  return false;
}
