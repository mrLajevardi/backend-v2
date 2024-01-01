export const vpcTemplatesMock = [
  {
    datacenter: { name: 'amin', title: 'امین' },
    items: {
      generation: {
        cpu: {
          title: '',
          unit: 'Core',
          value: 10,
          id: 1,
          code: 'l0',
        },
        vm: {
          title: '',
          unit: 'Server',
          value: 5,
          id: 2,
          code: 'vm',
        },
        ram: {
          title: '',
          unit: 'MB',
          value: 2048,
          id: 10,
          code: 'l0',
        },
        disk: [
          {
            title: 'archive',
            unit: 'MB',
            value: 102400,
            code: 'standard',
            id: 5,
          },
          {
            id: '',
            code: '',
            title: 'standard',
            unit: 'MB',
            value: 2048,
          },
        ],
        ip: {
          title: '',
          unit: 'IP',
          value: 14,
          code: 'ip',
          id: 134,
        },
      },
      guaranty: { title: 'VIP', id: 132, value: null },
      reservationRam: {
        title: 'reservationRam',
        value: 0.25,
        id: 100,
        code: 'reservation-item',
        unit: null,
      },
      reservationCpu: { value: 0.1, id: 101 },
      period: { title: 'سه ماهه', value: 3, id: 1399 },
    },
    generation: 'G2',
    description: '',
    rawPrice: 8000,
    finalPrice: 10000,
  },
];
