import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToDollar } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  } else {
    return false;
  }
}

async function getCheck(id: number) {
  const check = await db.check.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  console.log(check);

  return check;
}

export default async function CheckDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const check = await getCheck(id);
  if (!check) {
    return notFound();
  }

  const isOwner = await getIsOwner(check.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={check.photo} alt={check.title} />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full">
          {check.user.avatar !== null ? (
            <Image
              src={check.user.avatar}
              width={40}
              height={40}
              alt={check.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{check.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{check.title}</h1>
        <p>{check.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          $ {formatToDollar(check.amount)}
        </span>
        {isOwner && (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete Check
          </button>
        )}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          Chat
        </Link>
      </div>
    </div>
  );
}
