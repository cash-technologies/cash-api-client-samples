const https = require('https');
const Buffer = require('buffer').Buffer;

// This method is used to get the payment link list
const getPaymentLinkList = (api_key, antifraudMetadata) => {
    const antifraudMetadataBase64 = Buffer.from(JSON.stringify(antifraudMetadata)).toString('base64');
    const options = {
        method: 'GET',
        headers: {
            'X-Api-Client-Key': api_key,
            'X-Cash-Anti-Fraud-Metadata': antifraudMetadataBase64,
            'Content-Type': 'application/json'
        },
    };
    const url = `https://sandbox.api.holacash.mx/v2/payment_link?limit=1`;
    return new Promise((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            let data = ''
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                const parsedData = JSON.parse(data);
                if ([200, 201].includes(response.statusCode)) {
                    resolve(parsedData);
                    return;
                }
                reject(parsedData);
            });
        }).on('error', err => reject(err));
        request.end();
    });
};

// This method is used to create a payment link
const createPaymentLink = (body, api_key, antifraudMetadata) => {
    const antifraudMetadataBase64 = Buffer.from(JSON.stringify(antifraudMetadata)).toString('base64');
    const options = {
        method: 'POST',
        headers: {
            'X-Api-Client-Key': api_key,
            'X-Cash-Anti-Fraud-Metadata': antifraudMetadataBase64,
            'Content-Type': 'application/json'
        },
    };
    const url = 'https://sandbox.api.holacash.mx/v2/payment_link';
    return new Promise((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            let data = ''
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                const parsedData = JSON.parse(data);
                if ([200, 201].includes(response.statusCode)) {
                    resolve(parsedData);
                    return;
                }
                reject(parsedData);
            });
        }).on('error', err => reject(err));
        request.write(JSON.stringify(body));
        request.end();
    });
};

// This method is used to get the details of a payment link with payment_link_id
const getPaymentLink = (payment_link_id, api_key, antifraudMetadata) => {
    const antifraudMetadataBase64 = Buffer.from(JSON.stringify(antifraudMetadata)).toString('base64');
    const options = {
        method: 'GET',
        headers: {
            'X-Api-Client-Key': api_key,
            'X-Cash-Anti-Fraud-Metadata': antifraudMetadataBase64,
            'Content-Type': 'application/json'
        },
    };
    const url = `https://sandbox.api.holacash.mx/v2/payment_link/${payment_link_id}`;
    return new Promise((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            let data = ''
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                const parsedData = JSON.parse(data);
                if ([200, 201].includes(response.statusCode)) {
                    resolve(parsedData);
                    return;
                }
                reject(parsedData);
            });
        }).on('error', err => reject(err));
        request.end();
    });
};

// This method is used to update the payment link with payment_link_id
const updatePaymentLink = (body, payment_link_id, api_key, antifraudMetadata) => {
    const antifraudMetadataBase64 = Buffer.from(JSON.stringify(antifraudMetadata)).toString('base64');
    const options = {
        method: 'PATCH',
        headers: {
            'X-Api-Client-Key': api_key,
            'X-Cash-Anti-Fraud-Metadata': antifraudMetadataBase64,
            'Content-Type': 'application/json'
        },
    };
    const url = `https://sandbox.api.holacash.mx/v2/payment_link/${payment_link_id}`;
    return new Promise((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            let data = ''
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                const parsedData = JSON.parse(data);
                if ([200, 201].includes(response.statusCode)) {
                    resolve(parsedData);
                    return;
                }
                reject(parsedData);
            });
        }).on('error', err => reject(err));
        request.write(JSON.stringify(body));
        request.end();
    });
};
const ANTIFRAUD_METADATA = {
    ip_address: '192.168.0.100',
    device_id: 'somedevice_123456',
    user_timezone: '-06:00'
};

const CREATE_PAYMENT_LINK_REQUEST = {
    expiration_date: 1755921639,
    amount: {
        amount: 2000,
        currency_code: 'MXN'
    },
    amount_constraints: {
        conformance: 'fixed',
        minimum_amount: {
            amount: 2000,
            currency_code: 'MXN'
        },
        maximum_amount: {
            amount: 2000,
            currency_code: 'MXN'
        }
    },
    description: 'sai',
    max_num_times_can_be_paid: 1,
    collect_customer_notes: false
};

const UPDATE_PAYMENT_LINK_REQUEST = {
    expiration_date: 1755921639,
    description: 'new description',
    status: 'disabled',
};

if (require.main === module) {
    getPaymentLinkList(process.env.HOLACASH_API_KEY, ANTIFRAUD_METADATA)
        .then((body) => {
            console.log(body);
        })
        .catch((body) => {
            console.error(body);
        });

    createPaymentLink(CREATE_PAYMENT_LINK_REQUEST, process.env.HOLACASH_API_KEY, ANTIFRAUD_METADATA)
        .then((body) => {
            console.log(body);
            payment_link_id = body.id;
            getPaymentLink(payment_link_id, process.env.HOLACASH_API_KEY, ANTIFRAUD_METADATA)
                .then((body) => {
                    console.log(body);
                })
                .catch((body) => {
                    console.error(body);
                });
            updatePaymentLink(UPDATE_PAYMENT_LINK_REQUEST, payment_link_id, process.env.HOLACASH_API_KEY, ANTIFRAUD_METADATA)
                .then((body) => {
                    console.log(body);
                })
                .catch((body) => {
                    console.error(body);
                });
        })
        .catch((body) => {
            console.error(body);
        });
}
