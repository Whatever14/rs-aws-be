const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	const dynamoDB = new DynamoDBClient();

	const productsTableName = process.env.PRODUCTS_TABLE_NAME;
	const stocksTableName = process.env.STOCKS_TABLE_NAME;
	const imagesTableName = process.env.IMAGES_TABLE_NAME;

	const scanProductsCommand = new ScanCommand({
		TableName: productsTableName,
	});
	const scanStocksCommand = new ScanCommand({ TableName: stocksTableName });
	const scanImagesCommand = new ScanCommand({ TableName: imagesTableName });

	try {
		const products = await dynamoDB.send(scanProductsCommand);
		const stocks = await dynamoDB.send(scanStocksCommand);
		const images = await dynamoDB.send(scanImagesCommand);

		const extendedProducts = [];

		for (let i = 0; i < products.Items.length; i++) {
			const stocksData = stocks.Items.find(
				(stock) => stock.product_id.S === products.Items[i].id.S
			);
			const imagesData = images.Items.find(
				(image) => image.product_id.S === products.Items[i].id.S
			);

			extendedProducts.push({
				id: products.Items[i].id.S,
				description: products.Items[i].description.S,
				price: products.Items[i].price.N,
				title: products.Items[i].title.S,
				count: stocksData.count.N,
				imageURL: imagesData.imageURL.S,
			});
		}

		return sendRes(200, extendedProducts);
	} catch (error) {
		return sendRes(500, {
			message: `Error reading from DynamoDB: ${error}`,
		});
	}
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
