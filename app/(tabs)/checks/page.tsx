import CheckList from "@/components/check-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialCheckes() {
  const checks = await db.check.findMany({
    select: {
      title: true,
      amount: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return checks;
}

export type InitialChecks = Prisma.PromiseReturnType<typeof getInitialCheckes>;

export default async function Check() {
  const initialChecks = await getInitialCheckes();
  return (
    <div className="p-5 flex flex-col gap-5">
      <CheckList initialChecks={initialChecks} />
    </div>
  );
}
