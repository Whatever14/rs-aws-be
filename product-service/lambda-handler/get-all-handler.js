const mockedProductsList = [
	{
		description: '2003 · 311 000 km · 2 926 cm3 · Diesel',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
		price: 10000,
		title: 'BMW x5',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/x5.jfif',
	},
	{
		description: '2005 · 369 000 km · 2 393 cm3 · Benzyna+LPG',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
		price: 15000,
		title: 'Audi A6',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/a6.jfif',
	},
	{
		description: '2007 · 366 400 km · 2 982 cm3 · Diesel',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
		price: 25000,
		title: 'Toyota Land Cruiser',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/land-cruiser.jfif',
	},
	{
		description: '1992 · 25 000 km · 4 973 cm3 · Benzyna',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80ab',
		price: 20000,
		title: 'Mercedes-Benz class S',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/w140.jfif',
	},
	{
		description: '1997 · 257 000 km · 5 210 cm3 · Benzyna',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80a4',
		price: 10000,
		title: 'Jeep Grand Cherokee',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/grand-cherokee.jfif',
	},
	{
		description: '2007 · 57 000 km · 4 966 cm3 · Benzyna',
		id: '7567ec4b-b10c-48c5-9345-fc73c48a80a6',
		price: 22000,
		title: 'Mercedes-Benz class G',
		image: 'https://store-images-rs-aws.s3.eu-central-1.amazonaws.com/g.jfif',
	},
];

exports.handler = async function (event) {
	console.log('request', JSON.stringify(event));

	return sendRes(200, mockedProductsList);
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
