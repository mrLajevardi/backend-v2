import { Test, TestingModule } from '@nestjs/testing';

describe('ServiceService', () => {
  //let service: ServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // CrudModule,
        // DatabaseModule,
        // SessionsModule,
        // LoggerModule,
        // UserModule,
        // PaymentModule,
        // forwardRef(() => InvoicesModule),
        // forwardRef(() => VgpuModule),
        // forwardRef(() => TasksModule),
        // TransactionsModule,
      ],
      providers: [
        // PayAsYouGoService,
        // CreateServiceService,
        // ExtendServiceService,
        // DiscountsService,
        // ServiceChecksService,
        // DeleteServiceService,
      ],
    }).compile();

    //service = module.get<ServiceService>(ServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    //expect(service).toBeDefined();
  });
});
