export const InvoiceItemDetailsMock = {
  datacenter: { name: 'amin', title: 'امین' },
  cpu: { price: 1000, title: '', unit: 'Core', quantity: 10 },
  vm: { price: 1000, title: '', unit: 'Server', quantity: 5 },
  ram: { price: 1000, title: '', unit: 'GB', quantity: 10 },
  disk: [
    {
      price: 25000,
      title: 'archive',
      unit: 'GB',
      quantity: 10,
    },
    { price: 20000, title: 'standard', unit: 'GB', quantity: 20 },
  ],
  guaranty: 'VIP',
  period: 150,
  ip: { price: 20000, title: '', unit: 'IP', quantity: 14 },
  generation: 'G2',
  finalPrice: 10000,
  reservationRam: 25,
  reservationCpu: 25,
};
