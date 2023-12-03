const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	const regex = new RegExp(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	);

	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	}

	const dynamoDB = new DynamoDBClient();

	const productsTableName = process.env.PRODUCTS_TABLE_NAME;
	const stocksTableName = process.env.STOCKS_TABLE_NAME;
	const imagesTableName = process.env.IMAGES_TABLE_NAME;
	const newProductId = uuidv4();

	if (event.body) {
		const newProductData = JSON.parse(event.body);

		try {
			if (
				newProductData.description &&
				typeof newProductData.description === 'string' &&
				newProductData.price &&
				!isNaN(newProductData.price) &&
				newProductData.title &&
				typeof newProductData.title === 'string' &&
				newProductData.count &&
				!isNaN(newProductData.count)
			) {
				const productsTableData = {
					id: { S: newProductId },
					description: { S: newProductData.description },
					price: { N: newProductData.price },
					title: { S: newProductData.title },
				};
				const stocksTableData = {
					product_id: { S: newProductId },
					count: { N: newProductData.count },
				};
				const imagesTableData = {
					product_id: { S: newProductId },
					imageURL: { S: 'default' },
				};

				const productsParams = {
					TableName: productsTableName,
					Item: productsTableData,
				};
				const stocksParams = {
					TableName: stocksTableName,
					Item: stocksTableData,
				};
				const imagesParams = {
					TableName: imagesTableName,
					Item: imagesTableData,
				};

				const putProductCommand = new PutItemCommand(productsParams);
				const putStockCommand = new PutItemCommand(stocksParams);
				const putImageCommand = new PutItemCommand(imagesParams);

				await dynamoDB.send(putProductCommand);
				await dynamoDB.send(putStockCommand);
				await dynamoDB.send(putImageCommand);

				return sendRes(200, {
					id: productsTableData.id.S,
					description: productsTableData.description.S,
					price: productsTableData.price.N,
					title: productsTableData.title.S,
					count: stocksTableData.count.N,
					imageURL: imagesTableData.imageURL.S,
				});
			}

			return sendRes(400, {
				message: 'Error: Please provide valid product data',
			});
		} catch (error) {
			return sendRes(500, {
				message: `Error writing to DynamoDB: ${error}`,
			});
		}
	}

	return sendRes(500, { message: 'Error: Please provide product data' });
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
