export const GetVdcIdBy = (vdcIdProperties: string): string => {
  const res = vdcIdProperties.split(':')[3];
  return res;
};
