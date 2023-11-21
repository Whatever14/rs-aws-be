const mockedProductsList = [
	{
		description: '2003 · 311 000 km · 2 926 cm3 · Diesel',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
		price: 10000,
		title: 'BMW x5',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/x5.jfif',
	},
	{
		description: '2007 · 57 000 km · 4 966 cm3 · Benzyna',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
		price: 22000,
		title: 'Mercedes-Benz class G',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/g.jfif',
	},
];

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	const regex = new RegExp(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	);

	if (
		event.hasOwnProperty('pathParameters') &&
		event.pathParameters.hasOwnProperty('productId')
	) {
		const productId = event.pathParameters.productId;

		if (regex.test(productId)) {
			for (let i = 0; i < mockedProductsList.length; i++) {
				if (mockedProductsList[i].id === productId) {
					return sendRes(200, mockedProductsList[i]);
				}
			}

			return sendRes(404, { message: 'Error: Product not found' });
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
