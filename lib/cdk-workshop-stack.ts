import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { TableViewer } from 'cdk-dynamo-table-viewer';

/**
 * Import a construct that you defined.
 */
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'hello.handler', // file is "hello", function is "handler"
    });

    /**
     * Using the custom defined construct.
     */
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    /**
     * Creates an API gateway and hooks upto the lambda function.
     * How does it get it's permission to invoke the lambda function?
     */
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler, // where helloWithCounter.handler is a variable of lambda.Function
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
    });
  }
}
