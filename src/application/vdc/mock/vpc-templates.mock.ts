export const vpcTemplatesMock = {
  datacenter: { name: 'amin', title: 'امین' },
  cpu: { price: 1000, title: '', unit: 'Core', quantity: 10 },
  vm: { price: 1000, title: '', unit: 'Server', quantity: 5 },
  ram: { price: 1000, title: '', unit: 'MB', quantity: 2048 },
  disk: [
    {
      price: 25000,
      title: 'archive',
      unit: 'MB',
      quantity: 102400,
      usage: 1024,
    },
    {
      price: 20000,
      title: 'standard',
      unit: 'MB',
      quantity: 2048,
      usage: 1024,
    },
  ],
  ip: { price: 20000, title: '', unit: 'IP', quantity: 14 },
  guaranty: 'VIP',
  generation: 'G2',
  rawPrice: 8000,
  finalPrice: 10000,
  reservationRam: 0.25,
  reservationCpu: 0.1,
  servicePlanType: 0,
  periods: [
    { name: 'شش ماهه', value: 6 },
    { name: 'سه ماهه', value: 3 },
  ],
};
