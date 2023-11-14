export function getCookieValue(cookieName: string) {
  // Get all cookies as a string.
  const cookies = document.cookie;

  // Split the cookies string into an array of individual cookies.
  const cookieArray = cookies.split('; ');

  // Find the cookie with the specified name.
  const cookie = cookieArray.find((cookie) => cookie.startsWith(cookieName + '='));

  // If the cookie exists, return its value. Otherwise, return null.
  return cookie ? cookie.split('=')[1] : null;
}
