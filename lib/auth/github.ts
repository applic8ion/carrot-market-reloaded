export async function getGithubAccessToken(code: string): Promise<any> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  return await accessTokenResponse.json();
}

export async function getGithubEmail(access_token: string): Promise<string> {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  let email = "";
  const githubEmail = await userEmailResponse.json();

  for (let mail of githubEmail) {
    if (mail.primary && mail.verified && mail.visibility === "public") {
      email = mail.email;
      break;
    }
  }

  return email;
}

export async function getGithubUserProfile(access_token: string): Promise<any> {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return await userProfileResponse.json();
}
