import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export interface HitCounterProps {
  downstream: lambda.IFunction;
}

export class HitCounter extends cdk.Construct {
  /**
   * Declared a class variable.
   */
  public readonly handler: lambda.Function;
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    /**
     * Declared a new dynamodb table.
     */
    this.table = new dynamodb.Table(this, 'Hits', {
      partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
    });

    this.handler = new lambda.Function(this, 'HitCounterHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hitcounter.handler',
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName,
      },
    });

    /**
     * Allow the lambda function to read and write to the table.
     */
    this.table.grantReadWriteData(this.handler);

    /**
     * Allow the the lambda function to call the downstream lambda function.
     */
    props.downstream.grantInvoke(this.handler);
  }
}
