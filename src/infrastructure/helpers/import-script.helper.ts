export const importScript = async (path: string): Promise<any> => {
  const module = await import(path);
  return module.default;
};
