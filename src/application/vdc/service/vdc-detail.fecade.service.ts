import { Injectable } from '@nestjs/common';
import { NetworksService } from '../../networks/networks.service';
import { FirewallService } from '../../edge-gateway/service/firewall.service';
import { NatService } from '../../nat/nat.service';
import { EdgeGatewayService } from '../../edge-gateway/service/edge-gateway.service';
import { ApplicationPortProfileService } from '../../edge-gateway/service/application-port-profile.service';
import { VdcService } from './vdc.service';
import { VmService } from '../../vm/service/vm.service';

@Injectable()
export class VdcDetailFecadeService {
  public NetworkService: NetworksService = null;
  public FirewallService: FirewallService = null;
  public NatService: NatService = null;
  public EdgeGatewayService: EdgeGatewayService = null;
  public ApplicationPortProfileService: ApplicationPortProfileService = null;
  public VdcService: VdcService;
  public VmService: VmService;

  constructor(
    private readonly networkService: NetworksService,
    private readonly fireWallService: FirewallService,
    private readonly natService: NatService,
    private readonly edgeGatewayService: EdgeGatewayService,
    private readonly applicationPortProfileService: ApplicationPortProfileService,
    private readonly vdcService: VdcService,
    private readonly vmService: VmService,
  ) {
    this.NetworkService = networkService;
    this.FirewallService = fireWallService;
    this.NatService = natService;
    this.EdgeGatewayService = edgeGatewayService;
    this.ApplicationPortProfileService = applicationPortProfileService;
    this.VdcService = vdcService;
    this.VmService = vmService;
  }
}
