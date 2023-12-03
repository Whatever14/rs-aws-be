const cdk = require('aws-cdk-lib');
const path = require('path');

class ImportServiceStack extends cdk.Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		const importProductsFile = new cdk.aws_lambda.Function(
			this,
			'getProductsFileHandler',
			{
				runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
				handler: 'import-products-file.handler',
				code: cdk.aws_lambda.Code.fromAsset(
					path.join(__dirname, '../lambda-handler')
				),
				environment: {
					ACCESS_KEY_ID: 'AKIAZ2VCVPOD3IODKDYH',
					SECRET_ACCESS_KEY:
						'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',
					REGION: 'eu-central-1',
					BUCKET: 'uploaded-files-rs-aws',
				},
			}
		);

		const api = new cdk.aws_apigateway.RestApi(
			this,
			'get-products-file-api',
			{
				restApiName: 'query-string-path-param-api',
			}
		);

		api.root
			.resourceForPath('import')
			.addMethod(
				'GET',
				new cdk.aws_apigateway.LambdaIntegration(importProductsFile)
			);

		new cdk.CfnOutput(this, 'HTTP API URL', {
			value: api.url ?? 'Something went wrong...',
		});
	}
}

module.exports = { ImportServiceStack };
