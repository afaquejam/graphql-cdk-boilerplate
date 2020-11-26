import { CdkPipeline } from '@aws-cdk/pipelines';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import { NotesStack } from '../notes-stack/notes-stack';

export class GraphQlStack extends cdk.Stack {
  public readonly graphQlEndpoint: cdk.CfnOutput;
  public readonly graphQlApiKey: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphQlApi = new appsync.GraphqlApi(this, 'MainApi', {
      name: 'main-graphql-api',
      schema: appsync.Schema.fromAsset(`${__dirname}/schema.graphql`),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          // apiKeyConfig: {
          //   expires: cdk.Expiration.atTimestamp(1631579248000),
          // },
        },
      },
      xrayEnabled: true,
    });

    this.graphQlEndpoint = new cdk.CfnOutput(this, 'GraphQlApiUrl', {
      value: graphQlApi.graphqlUrl,
    });

    this.graphQlApiKey = new cdk.CfnOutput(this, 'GraphQlApiKey', {
      value: graphQlApi.apiKey || '',
    });

    new NotesStack(this, 'NotesStack', {
      graphQlApi,
    });
  }
}
