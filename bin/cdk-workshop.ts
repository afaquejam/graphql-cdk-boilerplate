#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WorkshopPipelineStack } from '../lib/ci-cd-pipeline/pipeline-stack';

const app = new cdk.App();
new WorkshopPipelineStack(app, 'CdkWorkshopPipelineStack');
