import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync';

interface NotesStackProps {
  graphQlApi: appsync.GraphqlApi;
}

export class NotesStack extends cdk.NestedStack {
  constructor(scope: cdk.Construct, id: string, props: NotesStackProps) {
    super(scope, id);

    const { graphQlApi } = props;

    const notesLambda = new lambda.Function(this, 'NotesHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(`${__dirname}/lambda`),
    });

    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    notesTable.grantFullAccess(notesLambda);
    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName);

    const lambdaDataSource = graphQlApi.addLambdaDataSource(
      'test',
      notesLambda,
    );

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createNote',
    });
  }
}
