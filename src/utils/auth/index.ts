import { cookies } from 'next/headers';

export default async function exchangeCodeForAccessToken(code: string) {
  const cookieStore = cookies();
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.append(
    'client_id',
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  );
  url.searchParams.append(
    'client_secret',
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  );
  url.searchParams.append('code', code);

  try {
    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = await response.json();
    cookieStore.set('access_token', access_token);
  } catch (error) {
    console.error('error', error);
    return { error };
  }
  return { error: null };
}
