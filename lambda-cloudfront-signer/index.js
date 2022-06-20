const cfsign = require('aws-cloudfront-sign');

const envKeyIdString = process.env['KEY_ID'];
const envPrivateKeyString = process.env['PRIVATE_KEY'];
const envBaseUrl = process.env['BASE_URL'];
const envApiSecret = process.env['API_SECRET'];

const oneDayMillis = 1000 * 60 * 60 * 24;

exports.handler = async (event) => {
  console.log({event});
  const headers = event.headers;
  if (envApiSecret !== headers['x-api-secret']) {
    return {
      statusCode: 401,
      body: 'Unauthorised',
    };
  }
  
  // validate
  if (!envKeyIdString) throw Error('Key ID key is required');
  if (!envPrivateKeyString) throw Error('Private key is required');
  if (!envBaseUrl) throw Error('Base URL is required');
  if (!envBaseUrl.endsWith('/')) throw Error('Base URL must end with trailing slash');
  
  const {
    s3key,
  } = event.queryStringParameters;

  const signingParams = {
    keypairId: envKeyIdString.trim(),
    privateKeyString: envPrivateKeyString,
    // Optional - this can be used as an alternative to privateKeyString
    // privateKeyPath: '/path/to/private/key',
    expireTime: new Date().getTime() + oneDayMillis,  // expires one day from now
  }

  // Generating a signed URL
  const signedUrl = cfsign.getSignedUrl(
      envBaseUrl + s3key,
      signingParams
  );

  return {
    statusCode: 200,
    body: {
      signedUrl: signedUrl
    },
  };
};
