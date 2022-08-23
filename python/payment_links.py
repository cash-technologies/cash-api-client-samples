import requests  # needs: pip install requests
import base64
import os
import json


CREATE_PAYMENT_LINK_REQUEST = {
    "expiration_date": 1755921639,
    "amount": {"amount": 2000, "currency_code": "MXN"},
    "amount_constraints": {
        "conformance": "variable",
        "minimum_amount": {"amount": 2000, "currency_code": "MXN"},
        "maximum_amount": {"amount": 20000, "currency_code": "MXN"},
    },
    "description": "sai",
    "max_num_times_can_be_paid": 1,
    "collect_customer_notes": False,
}

UPDATE_PAYMENT_LINK_REQUEST = {
    "description": "new description",
    "status": "disabled",
    "expiration_date": 1757663354,
}


def payment_link_list(api_key, cash_antifraud_metadata):
    url = "https://sandbox.api.holacash.mx/v2/payment_link?limit=1"
    response = requests.get(
        url,
        headers={
            "Content-Type": "application/json",
            "X-Api-Client-Key": api_key,
            "X-Cash-Anti-Fraud-Metadata": (
                base64.b64encode(bytes(json.dumps(cash_antifraud_metadata), "utf-8"))
            ),
        },
    )
    return response.json()


def create_payment_link(body, api_key, cash_antifraud_metadata):
    url = "https://sandbox.api.holacash.mx/v2/payment_link"
    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "X-Api-Client-Key": api_key,
            "X-Cash-Anti-Fraud-Metadata": (
                base64.b64encode(bytes(json.dumps(cash_antifraud_metadata), "utf-8"))
            ),
        },
        json=body,
    )
    return response.json()


def payment_link_detail(payment_link_id, api_key, cash_antifraud_metadata):
    url = f"https://sandbox.api.holacash.mx/v2/payment_link/{payment_link_id}"
    response = requests.get(
        url,
        headers={
            "Content-Type": "application/json",
            "X-Api-Client-Key": api_key,
            "X-Cash-Anti-Fraud-Metadata": (
                base64.b64encode(bytes(json.dumps(cash_antifraud_metadata), "utf-8"))
            ),
        },
    )
    return response.json()


def update_payment_link_detail(body, payment_link_id, api_key, cash_antifraud_metadata):
    url = f"https://sandbox.api.holacash.mx/v2/payment_link/{payment_link_id}"
    response = requests.patch(
        url,
        headers={
            "Content-Type": "application/json",
            "X-Api-Client-Key": api_key,
            "X-Cash-Anti-Fraud-Metadata": (
                base64.b64encode(bytes(json.dumps(cash_antifraud_metadata), "utf-8"))
            ),
        },
        json=body,
    )
    return response.json()


ANTIFRAUD_METADATA = {
    "ip_address": "192.168.0.100",
    "device_id": "somedevice_123456",
    "user_timezone": "-06:00",
}

API_KEY = os.environ.get("HOLACASH_API_KEY")

if __name__ == "__main__":
    payment_link_list_response = payment_link_list(
        API_KEY,
        ANTIFRAUD_METADATA,
    )
    print("--------------payment_link_list_response--------------")
    print(json.dumps(payment_link_list_response))
    create_payment_link_response = create_payment_link(
        CREATE_PAYMENT_LINK_REQUEST,
        API_KEY,
        ANTIFRAUD_METADATA,
    )
    print("--------------create_payment_link_response--------------")
    print(json.dumps(create_payment_link_response))
    payment_link_id = create_payment_link_response["id"]
    payment_link_detail_response = payment_link_detail(
        payment_link_id,
        API_KEY,
        ANTIFRAUD_METADATA,
    )
    print("--------------payment_link_detail_response--------------")
    print(json.dumps(payment_link_detail_response))
    update_payment_link_detail_response = update_payment_link_detail(
        UPDATE_PAYMENT_LINK_REQUEST,
        payment_link_id,
        API_KEY,
        ANTIFRAUD_METADATA,
    )
    print("--------------update_payment_link_detail_response--------------")
    print(json.dumps(update_payment_link_detail_response))
