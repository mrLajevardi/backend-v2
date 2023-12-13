export const GetVdcIdBy = (vdcIdProperties: string) => {
  const res = vdcIdProperties.split(':')[3];
  return res;
};
