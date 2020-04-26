export const isVerifier = (user) => {
  if (user === undefined) {
    return false;
  }

  return user.hasOwnProperty("authority");
};
