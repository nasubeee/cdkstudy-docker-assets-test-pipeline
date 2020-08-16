import * as cdk from '@aws-cdk/core';
import { ResourceName } from './resource_name';
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');

export interface PipelineStackProps extends cdk.StackProps {
    resourceName: ResourceName;
}

export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
    }
}
