export function debounce<T>(fn: (args: T) => void, delay = 500) {
  let timer: NodeJS.Timeout;

  return (args: T) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(args);
    }, delay);
  };
}
