#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline';
import { ResourceName } from '../lib/resource_name';

const app = new cdk.App();

//==============================================================================
// Get Context and define stack env
//==============================================================================
const systemName = app.node.tryGetContext("system_name");
const systemEnv = app.node.tryGetContext("system_env");
const resourceName = new ResourceName(systemName, systemEnv);
const stackEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
};
//==============================================================================
// Get Context and define stack env end
//==============================================================================

const pipeline = new PipelineStack(app, 'pipeline', {
    stackName: resourceName.stackName(`pipeline`),
    description: `${resourceName.systemName}`,
    env: stackEnv,
    resourceName: resourceName,
});
