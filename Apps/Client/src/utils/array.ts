export const getRandom = <V> (arr: V[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const getRange = (size: number, order: 'ASC' | 'DESC' = 'ASC') => {
  const arr = [...Array(size).keys()];

  if (order === 'DESC') {
    return [...arr].reverse();
  }

  return arr;
}

export const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const toSortedArray = (obj: Record<string, number>, order: 'ASC' | 'DESC' = 'ASC') => {
  const arr = Object.entries(obj);
  let sortedArr = arr;

  if (order === 'ASC') {
      sortedArr = arr.sort((a, b) => a[1] - b[1]);
  }
  if (order === 'DESC') {
      sortedArr = arr.sort((a, b) => b[1] - a[1]);
  }

  return sortedArr.map(([ key, value ]) => ({ key, value }));
}

export const toReversedArray = <T> (arr: T[]): T[] => {
  return arr.slice().reverse();
}