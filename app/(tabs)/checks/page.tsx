import CheckList from "@/components/check-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

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
      <Link
        href="/checks/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
