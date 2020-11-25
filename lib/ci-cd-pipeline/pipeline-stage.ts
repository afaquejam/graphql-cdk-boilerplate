import { CdkWorkshopStack } from '../cdk-workshop-stack/cdk-workshop-stack';
import { Stage, CfnOutput, Construct, StageProps } from '@aws-cdk/core';

/**
 * Declaring a Pipeline stage, in which you create a "construct" named CdkWorkshopStack.
 */
export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CdkWorkshopStack(this, 'WebService');
    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}
