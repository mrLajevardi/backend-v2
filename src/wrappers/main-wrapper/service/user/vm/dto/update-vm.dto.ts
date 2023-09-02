import { CreateVmDto } from './create-vm.dto';

export class UpdateVmDto extends CreateVmDto {
  adaptorType: string;
}
