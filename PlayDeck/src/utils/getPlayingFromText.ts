export const getPlayingFromText = (playingQueueFrom: string[]) => {
  let startText = '',
    list = '';
  if (playingQueueFrom.length) {
    startText += 'Playing from ';
    list = playingQueueFrom[0];

    for (let i = 1; i < playingQueueFrom.length; i++) {
      list += ', ' + playingQueueFrom[i];
    }
  }

  return {startText, list};
};
