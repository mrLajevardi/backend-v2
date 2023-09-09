export interface GetEdgeClusterDto {
  values: GetEdgeClusterValue[];
}

export interface GetEdgeClusterValue {
  id: string;
  name: string;
  description: null;
  nodeCount: number;
  nodeType: string;
  deploymentType: string;
}
