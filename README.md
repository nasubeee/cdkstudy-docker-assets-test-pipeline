# CI/CD pipeline for CDK Docker Assets Test Project

[CDK Docker Assets Test Project](https://github.com/nasubifujii/cdk-docker-assets-test)のCI/CD パイプライン.


![Architecture](./doc/architecture.svg)

## Deploy方法

CDKのコンテキストでGithubのリポジトリオーナーとリポジトリ名を与える．

```sh
cdk deploy -c github_user="オーナー名" -c repos_name="リポジトリ名"
```

Githubのアクセストークンは，事前にAWSアカウントのSSM Parameter Storeに，`パラメータ名: /github/"オーナー名"/access-token`で保管されているものを取得する実装とした．

