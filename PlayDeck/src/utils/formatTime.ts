const getTimeFromSeconds = (seconds: number) => {
  const mins = (Math.floor(seconds / 60) % 60).toString().padStart(2, '0');
  const hours = Math.floor(seconds / (60 * 60)) % 60;
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0');

  return {mins, hours, sec};
};

export const formatTime = (seconds: number) => {
  const {mins, hours, sec} = getTimeFromSeconds(seconds);

  return hours > 0 ? `${hours}:${mins}:${sec}` : `${mins}:${sec}`;
};

export const formatTimeInLetters = (seconds: number) => {
  const {mins, hours, sec} = getTimeFromSeconds(seconds);

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m ${sec}s`;
};
