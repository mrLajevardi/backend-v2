import { VmPowerStateEventEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';

export interface LastVmStates {
  vmStates: VmStates[];
}

interface VmStates {
  id: string;
  state: VmPowerStateEventEnum;
}
