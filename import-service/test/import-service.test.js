const importProductsFileHandler = require('../lambda-handler/import-products-file');

test('Import products file handler test', async () => {
	const noPathParamResponse = await importProductsFileHandler.handler({});
	const noNameParamResponse = await importProductsFileHandler.handler({
		queryStringParameters: { productId: '123' },
	});

	process.env.ACCESS_KEY_ID = 'AKIAZ2VCVPOD3IODKDYH';
	process.env.SECRET_ACCESS_KEY = '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';
	process.env.REGION = 'eu-central-1';
	process.env.BUCKET = 'uploaded-files-rs-aws';

	const validParamResponse = await importProductsFileHandler.handler({
		queryStringParameters: { name: 'name' },
	});
	// const invalidProductIdResponse = await getOneHandler.handler({
	// 	pathParameters: { productId: '123' },
	// });
	// const unexistingIdResponse = await getOneHandler.handler({
	// 	pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a8014' },
	// });
	// const validIdResponse = await getOneHandler.handler({
	// 	pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
	// });

	expect(noPathParamResponse.statusCode).toBe(400);
	expect(JSON.parse(noPathParamResponse.body).message).toEqual(
		'Error: Missing parameters'
	);
	expect(noNameParamResponse.statusCode).toBe(400);
	expect(JSON.parse(noNameParamResponse.body).message).toEqual(
		'Error: Missing name parameter'
	);
	expect(validParamResponse.statusCode).toBe(200);
	expect(
		JSON.parse(validParamResponse.body).includes(
			'https://uploaded-files-rs-aws.s3.eu-central-1.amazonaws.com/uploaded/'
		)
	).toBe(true);
	expect(
		JSON.parse(validParamResponse.body).includes('name?X-Amz-Algorithm=')
	).toBe(true);
	expect(
		JSON.parse(validParamResponse.body).includes('X-Amz-Content-Sha256=')
	).toBe(true);
	expect(
		JSON.parse(validParamResponse.body).includes('X-Amz-Credential=')
	).toBe(true);
	expect(JSON.parse(validParamResponse.body).includes('X-Amz-Date=')).toBe(
		true
	);
	expect(JSON.parse(validParamResponse.body).includes('X-Amz-Expires=')).toBe(
		true
	);
	expect(
		JSON.parse(validParamResponse.body).includes('X-Amz-Signature=')
	).toBe(true);
	expect(
		JSON.parse(validParamResponse.body).includes('X-Amz-SignedHeaders=')
	).toBe(true);
});
