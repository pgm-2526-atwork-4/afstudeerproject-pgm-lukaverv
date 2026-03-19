/**
 * Returns a function to check whether the currently logged-in user
 * is the producer of a given beat.
 *
 * Uses the user-level ID (`userProfile.userId === beat.producerUserId`)
 * which is consistently available on all beat objects returned by the API.
 */
export const useIsOwnBeat = () => {
  const userProfile = useState<any>("userProfile");

  const isOwnBeat = (beat: { producerUserId?: string } | null | undefined) =>
    !!userProfile.value &&
    !!beat &&
    userProfile.value.userId === beat.producerUserId;

  return { isOwnBeat };
};
