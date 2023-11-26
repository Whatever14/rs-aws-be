import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';

export class ProductServiceStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const productsTableArn =
			'arn:aws:dynamodb:eu-central-1:675724753799:table/products';
		const stocksTableArn =
			'arn:aws:dynamodb:eu-central-1:675724753799:table/stocks';
		const imagesTableArn =
			'arn:aws:dynamodb:eu-central-1:675724753799:table/images';

		const productsTable = cdk.aws_dynamodb.Table.fromTableArn(
			this,
			'products',
			productsTableArn
		);
		const stocksTable = cdk.aws_dynamodb.Table.fromTableArn(
			this,
			'stocks',
			stocksTableArn
		);
		const imagesTable = cdk.aws_dynamodb.Table.fromTableArn(
			this,
			'images',
			imagesTableArn
		);

		const getProductsList = new cdk.aws_lambda.Function(
			this,
			'getAllProductsHandler',
			{
				runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
				handler: 'get-all-handler.handler',
				code: cdk.aws_lambda.Code.fromAsset(
					path.join(__dirname, '../lambda-handler')
				),
				environment: {
					PRODUCTS_TABLE_NAME: productsTable.tableName,
					STOCKS_TABLE_NAME: stocksTable.tableName,
					IMAGES_TABLE_NAME: imagesTable.tableName,
				},
				timeout: cdk.Duration.seconds(10),
			}
		);

		productsTable.grantReadWriteData(getProductsList);
		stocksTable.grantReadWriteData(getProductsList);
		imagesTable.grantReadWriteData(getProductsList);

		const getProductsById = new cdk.aws_lambda.Function(
			this,
			'getOneProductHandler',
			{
				runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
				handler: 'get-one-handler.handler',
				code: cdk.aws_lambda.Code.fromAsset(
					path.join(__dirname, '../lambda-handler')
				),
			}
		);

		const api = new cdk.aws_apigateway.RestApi(this, 'get-product-api');

		api.root
			.resourceForPath('products')
			.addMethod(
				'GET',
				new cdk.aws_apigateway.LambdaIntegration(getProductsList)
			);

		api.root
			.resourceForPath('products/{productId}')
			.addMethod(
				'GET',
				new cdk.aws_apigateway.LambdaIntegration(getProductsById)
			);

		new cdk.CfnOutput(this, 'HTTP API URL', {
			value: api.url ?? 'Something went wrong...',
		});
	}
}
