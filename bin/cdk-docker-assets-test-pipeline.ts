#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkDockerAssetsTestPipelineStack } from '../lib/cdk-docker-assets-test-pipeline-stack';

const app = new cdk.App();
new CdkDockerAssetsTestPipelineStack(app, 'CdkDockerAssetsTestPipelineStack');
