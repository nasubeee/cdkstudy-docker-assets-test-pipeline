import * as cdk from '@aws-cdk/core';

export class ResourceName {
    public readonly systemName: string;
    public readonly systemEnv: string;

    constructor(systemName: string, env: string) {
        this.systemName = systemName;
        this.systemEnv = env;
    }

    private generate(suffix: string): string {
        return `${this.systemName}-${this.systemEnv}-${suffix}`;
    }

    public stackName(name?: string): string {
        return this.generate(name ? `${name}-stack` : `stack`);
    }

    public vpcName(name: string): string {
        return this.generate(`${name}-vpc`);
    }

    public securityGroupName(name: string): string {
        return this.generate(`${name}-sg`);
    }

    public vpcEndpointName(name: string): string {
        return this.generate(`vpce-${name}`);
    }

    public bucketName(name: string): string {
        return this.generate(`${name}-bukcet`).toLowerCase();
    }

    public keyName(name: string): string {
        return this.generate(`${name}-key`);
    }

    public lambdaName(name: string): string {
        return this.generate(`${name}-function`);
    }

    public apiName(name: string): string {
        return this.generate(`${name}-api`);
    }

    public roleName(name: string): string {
        return this.generate(`${name}-role`);
    }

    public instanceProfileName(name: string): string {
        return this.generate(`${name}-instance-profile`);
    }

    public batchComputeEnvName(name: string): string {
        return this.generate(`${name}-compute-env`);
    }

    public batchQueueName(name: string): string {
        return this.generate(`${name}-job-queue`);
    }

    public batchJobDefName(name: string): string {
        return this.generate(`${name}-job-def`);
    }

    public batchInstanceNameTag(name: string): string {
        return this.generate(`${name}-instance`);
    }

    public ecrRepositoryName(name: string): string {
        return `${this.systemName}/${this.systemEnv}/${name}`.toLowerCase();
    }

    public ssmParamName(name: string): string {
        return `/${this.systemName}/${this.systemEnv}/${name}`;
    }

    public launchTemplateName(name: string): string {
        return this.generate(`${name}-launch-template`);
    }

    public generalName(name: string): string {
        return this.generate(`${name}`);
    }

    public cfnSystemTags() {
        return { system: this.systemName, env: this.systemEnv };
    }
}

export function addNameTag(scope: cdk.Construct, name: string, props?: cdk.TagProps | undefined) {
    cdk.Tag.add(scope, "Name", name, props);
}
