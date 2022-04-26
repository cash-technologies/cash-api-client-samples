crypto = require("crypto")

const exampleSignature = '1654193444.503824,16B6B86DD8A584C844E4BB71EA6401B33E3D6290E4AD934459DF883195920301'
const exampleKey = 'whk_local_o68NxNkDvMbqR669FKoL68D4zagIFck1eKmh2tv5'
const sampleJson = {
   "event_type": "charge.succeeded",
   "payload": {
      "additional_detail": [

      ],
      "charge": {
         "amount_details": {
            "amount": 2100,
            "currency_code": "MXN"
         },
         "consumer_details": {
            "contact": {
               "email": "a_happy_merchant@a_neat_domain.com",
               "phone_1": "4242424242"
            },
            "external_consumer_id": "00001",
            "name": {
               "first_last_name": "Cash",
               "first_name": "Test",
               "second_first_name": "Hola",
               "second_last_name": "User"
            }
         },
         "description": "Order",
         "payment_detail": {
            "credentials": {
               "payment_method": {
                  "method": "pay_with_bank_account"
               }
            }
         },
         "processing_instructions": {
            "auto_capture": true
         },
         "purchase_details": {
            "external_system_order_id": "1234"
         }
      },
      "id": "e5ac4ea4-a003-4d05-8176-d64925e9e2cc",
      "status_details": {
         "date_created": 1654110857827,
         "detail": {
            "additional_details": [
               {
                  "data": "completed",
                  "name": "charge_status"
               },
               {
                  "data": "success",
                  "name": "cash_exit_code"
               },
               {
                  "data": "Operación exitosa",
                  "name": "cash_exit_message"
               }
            ]
         },
         "message": "completed",
         "status": "success"
      },
      "cancellation_reason": null
   }
}

function escapeUnicode(str) {
    return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
 }

function validateHolaCashSignature(key, payload, holaCashSignHeader) {
    // Split sign header into the timestamp and signature components
    const [timestamp, server_signature] = holaCashSignHeader.split(",")

    // To generate the string to sign you have to concat the timestamp, a dot and the JSON.
    // The JSON should be a single line without spaces (The default behaviour of stringify function)
    jsonString=JSON.stringify(payload)

    // Escape Any no Base ASCII char to unicode string
    unicodeEscaped=escapeUnicode(jsonString)

    const stringToSign = timestamp + "." + unicodeEscaped

    // The signature is done with HMAC_SHA256 algorithm and the key you can get from the portal (Exclusive for webhooks)
    // The digest is converted to a Hex string for debugging purposes. You can use the bytes digest for the compare.
    const client_signature = crypto.createHmac('sha256', key).update(stringToSign).digest("hex").toUpperCase()

    // Cryptographically compare the 2 signatures. In this case we use the timingSafeEqual function from the crypto lib in node
    // You can use any crypto comparison. Avoid at any costs comparing strings.
    const signs_are_equal = crypto.timingSafeEqual(Buffer.from(client_signature, "utf-8"), Buffer.from(server_signature, "utf-8"))

    return signs_are_equal
}

// Print the result of the comparison
console.log("Are your signatures equal? " + validateHolaCashSignature(exampleKey, sampleJson, exampleSignature))