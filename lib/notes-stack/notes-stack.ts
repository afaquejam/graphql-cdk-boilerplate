import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class NotesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const notesLambda = new lambda.Function(this, 'NotesHanlder', {
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
  }
}
