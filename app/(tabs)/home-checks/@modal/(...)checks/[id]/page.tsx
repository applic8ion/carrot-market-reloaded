import CloseModalButton from "@/components/close-modal-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToUsd } from "@/lib/utils";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
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

  return check;
}

export default async function Modal({ params }: { params: { id: string } }) {
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
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black/60 left-0 top-0">
      <CloseModalButton />
      <div className="w-full max-w-screen-lg flex flex-col items-center">
        <div className="w-11/12 bg-neutral-900 rounded-md overflow-hidden">
          <div className="p-5">
            <div className="relative aspect-square">
              <Image
                fill
                className="object-contain rounded overflow-hidden"
                src={`${check.photo}`}
                alt={check.title}
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="py-3 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 rounded-full overflow-hidden">
                  {check.user.avatar !== null ? (
                    <Image
                      src={check.user.avatar}
                      alt={check.user.username}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>

                <div>
                  <h3 className="text-sm">{check.user.username}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <h1 className="text-xl font-semibold">{check.title}</h1>
                <p className="text-sm">{check.description}</p>
              </div>
            </div>
          </div>

          <div className="w-full p-5 bg-neutral-800 flex justify-between items-center">
            <span className="font-semibold text-xl">
              {formatToUsd(check.amount)}원
            </span>

            <div className="flex gap-x-5">
              <Link
                className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                href={``}
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
