import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { WorkshopPipelineStage } from './pipeline-stage';
import { SimpleSynthAction, CdkPipeline } from '@aws-cdk/pipelines';

export class WorkshopPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = new codecommit.Repository(this, 'WorkshopRepo', {
      repositoryName: 'WorkshopRepo',
    });

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline ', {
      pipelineName: 'WorkshopPipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.CodeCommitSourceAction({
        actionName: 'CodeCommit',
        output: sourceArtifact,
        repository: repo,
      }),

      /**
       * Build command will generate JS code and after this cdk synth command
       * will get executed, which will generated CF template. But how does
       * it deploy then? I think the library (CdkPipeline) automatically adds
       * the step of self-mutate, which basically run the cdk deploy command.
       */
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build',
      }),
    });

    /**
     * Creating a new stage.
     */
    const deploy = new WorkshopPipelineStage(this, 'Deploy');
    pipeline.addApplicationStage(deploy);
  }
}
