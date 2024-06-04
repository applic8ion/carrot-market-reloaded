"use server";

import db from "@/lib/db";

export async function getMoreChecks(page: number) {
  const checks = await db.check.findMany({
    select: {
      title: true,
      amount: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return checks;
}
