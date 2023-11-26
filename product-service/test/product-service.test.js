const getAllHandler = require('../lambda-handler/get-all-handler');
const getOneHandler = require('../lambda-handler/get-one-handler');

const mockedFirstProduct = {
	description: '2003 · 311 000 km · 2 926 cm3 · Diesel',
	id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
	price: 10000,
	title: 'BMW x5',
	image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/x5.jfif',
};

test('Get all products lambda handler test', async () => {
	const response = await getAllHandler.handler();

	expect(response.statusCode).toBe(200);
	expect(JSON.parse(response.body)[0]).toEqual(mockedFirstProduct);
});

test('Get one product by {productid} handler test', async () => {
	const noPathParamResponse = await getOneHandler.handler({});
	const noProductIdResponse = await getOneHandler.handler({
		pathParameters: { productId: '' },
	});
	const invalidProductIdResponse = await getOneHandler.handler({
		pathParameters: { productId: '123' },
	});
	const unexistingIdResponse = await getOneHandler.handler({
		pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a8014' },
	});
	const validIdResponse = await getOneHandler.handler({
		pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
	});

	expect(noPathParamResponse.statusCode).toBe(500);
	expect(JSON.parse(noPathParamResponse.body).message).toEqual(
		'Error: Please provide product id'
	);
	expect(noProductIdResponse.statusCode).toBe(500);
	expect(JSON.parse(noProductIdResponse.body).message).toEqual(
		'Error: Please provide valid product id'
	);
	expect(invalidProductIdResponse.statusCode).toBe(500);
	expect(JSON.parse(invalidProductIdResponse.body).message).toEqual(
		'Error: Please provide valid product id'
	);
	expect(validIdResponse.statusCode).toBe(200);
	expect(JSON.parse(validIdResponse.body)).toEqual(mockedFirstProduct);
});
