const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	try {
		if (!event.queryStringParameters) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Error: Missing parameters' }),
			};
		}

		if (!event.queryStringParameters.name) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: 'Error: Missing name parameter',
				}),
			};
		}

		const s3Configuration = {
			credentials: {
				accessKeyId: process.env.ACCESS_KEY_ID,
				secretAccessKey: process.env.SECRET_ACCESS_KEY,
			},
			region: process.env.REGION,
		};

		const s3 = new S3Client(s3Configuration);
		const command = new GetObjectCommand({
			Bucket: 'uploaded-files-rs-aws',
			Key: `uploaded/${event.queryStringParameters.name}`,
		});

		const signedUrl = await getSignedUrl(s3, command, {
			expiresIn: 20 * 60,
		});

		return sendRes(200, signedUrl);
	} catch (error) {
		return sendRes(500, {
			message: `Server error: ${error}`,
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
