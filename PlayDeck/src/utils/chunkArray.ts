export function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.reduce((result: T[][], item: T, index: number) => {
    const chunkIndex = Math.floor(index / size);

    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }

    result[chunkIndex].push(item);
    return result;
  }, []);
}
