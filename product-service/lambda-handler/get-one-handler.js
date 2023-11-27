const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	const regex = new RegExp(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	);

	const dynamoDB = new DynamoDBClient();

	const productsTableName = process.env.PRODUCTS_TABLE_NAME;
	const stocksTableName = process.env.STOCKS_TABLE_NAME;
	const imagesTableName = process.env.IMAGES_TABLE_NAME;

	const scanProductsCommand = new ScanCommand({
		TableName: productsTableName,
	});
	const scanStocksCommand = new ScanCommand({ TableName: stocksTableName });
	const scanImagesCommand = new ScanCommand({ TableName: imagesTableName });

	if (
		event.hasOwnProperty('pathParameters') &&
		event.pathParameters.hasOwnProperty('productId')
	) {
		const productId = event.pathParameters.productId;

		try {
			if (regex.test(productId)) {
				const products = await dynamoDB.send(scanProductsCommand);

				for (let i = 0; i < products.Items.length; i++) {
					if (products.Items[i].id.S === productId) {
						const stocks = await dynamoDB.send(scanStocksCommand);
						const images = await dynamoDB.send(scanImagesCommand);

						const stocksData = stocks.Items.find(
							(stock) =>
								stock.product_id.S === products.Items[i].id.S
						);
						const imagesData = images.Items.find(
							(image) =>
								image.product_id.S === products.Items[i].id.S
						);

						const productById = {
							id: products.Items[i].id.S,
							description: products.Items[i].description.S,
							price: products.Items[i].price.N,
							title: products.Items[i].title.S,
							count: stocksData.count.N,
							imageURL: imagesData.imageURL.S,
						};

						return sendRes(200, productById);
					}
				}

				return sendRes(404, { message: 'Error: Product not found' });
			}
		} catch (error) {
			return sendRes(500, {
				message: `Error reading from DynamoDB: ${error}`,
			});
		}

		return sendRes(500, {
			message: 'Error: Please provide valid product id',
		});
	}

	return sendRes(500, { message: 'Error: Please provide product id' });
};

const sendRes = (status, body) => {
	const response = {
		statusCode: status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(body),
	};

	return response;
};
