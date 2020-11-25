import { HitCounterStack } from '../hit-counter-stack/hit-counter-stack';
import { Stage, CfnOutput, Construct, StageProps } from '@aws-cdk/core';

/**
 * Declaring a Pipeline stage, in which you create a "construct" named HitCounterStack.
 */
export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new HitCounterStack(this, 'WebService');
    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}
