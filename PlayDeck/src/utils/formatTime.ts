export const formatTime = (seconds: number) => {
  const mins = (Math.floor(seconds / 60) % 60).toString().padStart(2, '0');
  const hours = Math.floor(seconds / (60 * 60)) % 60;
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0');

  return hours > 0 ? `${hours}:${mins}:${sec}` : `${mins}:${sec}`;
};
