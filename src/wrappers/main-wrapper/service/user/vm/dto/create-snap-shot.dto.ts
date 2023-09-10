import { CreateSnapshotParamsMetadata } from 'src/wrappers/vcloud-wrapper/services/user/vm/dto/create-vm-snap-shot.dto';

export type SnapShotsProperties = Omit<
  CreateSnapshotParamsMetadata,
  'xmlns:root'
>;
