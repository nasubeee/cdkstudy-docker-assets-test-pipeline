import * as cdk from '@aws-cdk/core';
import { ResourceName } from './resource_name';
import iam = require('@aws-cdk/aws-iam');
import ssm = require('@aws-cdk/aws-ssm');
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');

export interface PipelineStackProps extends cdk.StackProps {
    resourceName: ResourceName;
    githubOwnerName: string;
    sourceReposName: string;
}

export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        //======================================================================
        // Get github token from ssm parameter store
        //======================================================================
        const githubToken = ssm.StringParameter.valueForStringParameter(
            this, `/github/${props.githubOwnerName}/access-token`,
        );

        //======================================================================
        // Code build project role
        //======================================================================
        const buildProjectRole = new iam.Role(this, `build-project-role`, {
            roleName: props.resourceName.roleName(`deploy`),
            description: `${props.resourceName.systemName} role for cdk deploy.`,
            assumedBy: new iam.ServicePrincipal(`codebuild.amazonaws.com`),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(`AmazonEC2ContainerRegistryFullAccess`),
            ],
        });

        //======================================================================
        // Code build project
        //======================================================================
        const buildProject = new codebuild.PipelineProject(this, "build-project", {
            projectName: `${props.resourceName.systemName}-build-project`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename('./buildspec.yml'),
            role: buildProjectRole,
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_3_0,
                environmentVariables: {
                    AWS_DEFAULT_REGION: {
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                        value: this.region,
                    },
                    CDK_CONTEXT_SYSTEM_ENV: {
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                        value: props.resourceName.systemEnv,
                    },
                },
                privileged: true,
            },
        });

        //======================================================================
        // GitHub source action
        //======================================================================
        const sourceOutput = new codepipeline.Artifact();
        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GithubSource',
            owner: props.githubOwnerName,
            repo: props.sourceReposName,
            branch: `master`,
            oauthToken: cdk.SecretValue.plainText(githubToken),
            trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
            output: sourceOutput
        });

        //======================================================================
        // CDK deploy action
        //======================================================================
        const cdkDeployAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CDKDeploy',
            project: buildProject,
            input: sourceOutput,
        });

        //======================================================================
        // pipeline definition
        //======================================================================
        const pipeline = new codepipeline.Pipeline(this, `pipeline`, {
            pipelineName: `${props.resourceName.systemName}`,
            restartExecutionOnUpdate: false,
        });
        const sourceStage = pipeline.addStage({
            stageName: 'Source',
            actions: [sourceAction],
        });
        const deployStage = pipeline.addStage({
            stageName: 'Deploy',
            actions: [cdkDeployAction]
        });
    }
}
