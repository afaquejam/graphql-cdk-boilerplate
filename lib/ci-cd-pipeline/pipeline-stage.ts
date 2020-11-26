import { HitCounterStack } from '../hit-counter-stack/hit-counter-stack';
import { GraphQlStack } from '../graphql-stack/graphql-stack';
import { NotesStack } from '../notes-stack/notes-stack';
import { Stage, CfnOutput, Construct, StageProps } from '@aws-cdk/core';

/**
 * Declaring a Pipeline stage, in which you create a "construct" named HitCounterStack.
 */
export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;
  public readonly graphQlEndpoint: CfnOutput;
  public readonly graphQlApiKey: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const graphQlApi = new GraphQlStack(this, 'GraphQlApi');
    this.graphQlEndpoint = graphQlApi.graphQlEndpoint;
    this.graphQlApiKey = graphQlApi.graphQlApiKey;

    const service = new HitCounterStack(this, 'WebService');
    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;

    new NotesStack(this, 'NotesStack');
  }
}
