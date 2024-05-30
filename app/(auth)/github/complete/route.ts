import {
  getGithubAccessToken,
  getGithubEmail,
  getGithubUserProfile,
} from "@/lib/auth/github";
import db from "@/lib/db";
import { logInSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getGithubAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await getGithubUserProfile(access_token);
  const email = await getGithubEmail(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await logInSession(user.id);
    return redirect("/profile");
  }

  // check if same username exists in db
  const isExistUserName = Boolean(
    await db.user.findUnique({
      where: {
        username: login,
      },
      select: {
        id: true,
      },
    })
  );

  const newUser = await db.user.create({
    data: {
      username: isExistUserName ? `${login}-gh` : login,
      email: email !== null ? email : null,
      github_id: id + "", // convert number to string
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  await logInSession(newUser.id);
  return redirect("/profile");
}
