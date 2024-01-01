// export const groupBy = <T>(keys: (keyof T)[]) => (array: T[]): Record<string, T[]> =>
//     array.reduce((objectsByKeyValue, obj) => {
//       const value = keys.map((key) => obj[key]).join('-');
//       objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
//       return objectsByKeyValue;
//     }, {} as Record<string, T[]>);
type KeySelector<T> = (item: T) => string;

export function groupBy<T>(
  array: Iterable<T>,
  keySelector: KeySelector<T>,
): Record<string, T[]> {
  return Array.from(array).reduce(
    (acc: Record<string, T[]>, item: T) => {
      const key = keySelector(item);
      if (key in acc) {
        // found key, push new item into existing array
        acc[key].push(item);
      } else {
        // did not find key, create new array
        acc[key] = [item];
      }
      return acc;
    },
    {}, // start with empty object
  );
}
