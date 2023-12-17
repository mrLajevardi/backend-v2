export interface CreditInterface {
  withdraw(
    sourceId: number | string,
    amount: number,
    targetClass: CreditInterface,
    targetId: number | string,
  ): Promise<boolean>;

  deposit(targetId: number | string, amount: number): Promise<boolean>;

  getCreditAmount(id: number | string): Promise<number>;
}
