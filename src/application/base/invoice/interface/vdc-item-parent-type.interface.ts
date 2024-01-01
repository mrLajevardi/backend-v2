export class VdcParentType {
  generation: string[];
  cpuReservation: string[];
  memoryReservation: string[];
  period: string[];
  guaranty: string[];

  constructor() {
    this.generation = [];
    this.guaranty = [];
    this.period = [];
    this.cpuReservation = [];
    this.memoryReservation = [];
  }
}
