"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { getNow } from "@/lib/utils";
import { checkSchema } from "./schema";

export async function uploadCheck(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    amount: formData.get("amount"),
    description: formData.get("description"),
  };

  if (process.env.IS_CLOUDFLARE === "true") {
  } else {
    if (data.photo instanceof File) {
      const photoName = `${getNow()}_${data.photo.name}`;
      const photoData = await data.photo.arrayBuffer();
      await fs.appendFile(`./public/${photoName}`, Buffer.from(photoData));

      data.photo = photoName;
    }
  }

  const results = checkSchema.safeParse(data);

  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const check = await db.check.create({
        data: {
          title: results.data.title,
          description: results.data.description,
          amount: results.data.amount,
          photo: results.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/checks/${check.id}`);
    }
  }
}

export async function getIsCloudflare() {
  const isCloudflare = process.env.IS_CLOUDFLARE === "true";
  return isCloudflare;
}

export async function getCloudflarePhotoUrl() {
  const cloudflarePhotoUrl = process.env.CLOUDFLARE_PHOTO_URL;
  return cloudflarePhotoUrl;
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function getIsReactHookForm() {
  const isReactHookForm = process.env.IS_REACT_HOOK_FORM === "true";
  return isReactHookForm;
}
