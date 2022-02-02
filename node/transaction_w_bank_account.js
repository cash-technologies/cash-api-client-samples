const https = require('https');
const Buffer = require('buffer').Buffer;

const createCharge = (body, apiKey, antifraudMetadata) => {
    const antifraudMetadataBase64 = Buffer.from(JSON.stringify(antifraudMetadata)).toString('base64');
    const options = {
        method: 'POST',
        headers: {
            'X-Api-Client-Key': apiKey,
            'X-Cash-Anti-Fraud-Metadata': antifraudMetadataBase64
        },
        json: body,
        agent: false
    };
    const url = 'https://api-v2.sandbox.holacash.mx/v2/transaction/charge';
    return new Promise((resolve, reject) => {
        https.request(url, options, (response) => {
            response.on('data', (buffer) => {
                const parsedData = JSON.parse(buffer.toString());
                if ([200, 201].includes(response.statusCode)) {
                    resolve(parsedData);
                    return;
                }

                reject(parsedData);
            });
        }).end();
    });
};

const ANTIFRAUD_METADATA = {
    ip_address: '192.168.0.100',
    device_id: 'somedevice_123456',
    user_timezone: '-06:00'
};

const CREATE_CHARGE_REQUEST = {
    description: 'This is a test description',
    amount_details: {
        amount: 100,
        currency_code: 'MXN'
    },
    payment_detail: {
        credentials: {
        payment_method: {
            method: 'pay_with_bank_account'
        }
        }
    },
    consumer_details: {
        external_consumer_id: 'your_consumer_id',
        contact: {
            email: 'test_user@example.com'
        }
    },
    processing_instructions: {
        auto_capture: true
    }
};

if (require.main === module) {
    createCharge(CREATE_CHARGE_REQUEST, process.env.HOLACASH_API_KEY, ANTIFRAUD_METADATA)
        .then((body) => {
            console.log(body);
        })
        .catch((body) => {
            console.error(body);
        });
}

