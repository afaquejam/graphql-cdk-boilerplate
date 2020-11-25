import { CdkWorkshopStack } from './cdk-workshop-stack';
import { Stage, Construct, StageProps } from '@aws-cdk/core';

/**
 * Declaring a Pipeline stage, in which you create a "construct" named CdkWorkshopStack.
 */
export class WorkshopPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new CdkWorkshopStack(this, 'WebService');
  }
}
