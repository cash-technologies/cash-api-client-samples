# frozen_string_literal: true

require 'net/https'
require 'net/http/responses'
require 'json'
require 'base64'

# Get list of payment links
def get_payment_link_list(api_key, cash_antifraud_metadata)
  uri = URI('https://sandbox.api.holacash.mx/v2/payment_link?limit=1')
  request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
  request['X-Api-Client-Key'] = api_key
  request['X-Cash-Anti-Fraud-Metadata'] = Base64.encode64(cash_antifraud_metadata.to_json).gsub("\n", '')

  http = Net::HTTP.new(uri.hostname, uri.port)
  http.use_ssl = true
  response = http.request(request)

  return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)

  raise "Server error #{response.body}"
end

# Create a payment link
def create_payment_link(body, api_key, cash_antifraud_metadata)
    uri = URI('https://sandbox.api.holacash.mx/v2/payment_link')
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    request['X-Api-Client-Key'] = api_key
    request['X-Cash-Anti-Fraud-Metadata'] = Base64.encode64(cash_antifraud_metadata.to_json).gsub("\n", '')
    request.body = body.to_json
  
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true
    response = http.request(request)
  
    return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
  
    raise "Server error #{response.body}"
  end

# Get detail of payment link
def get_payment_link(payment_link_id, api_key, cash_antifraud_metadata)
    uri = URI("https://sandbox.api.holacash.mx/v2/payment_link/#{payment_link_id}")
    request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
    request['X-Api-Client-Key'] = api_key
    request['X-Cash-Anti-Fraud-Metadata'] = Base64.encode64(cash_antifraud_metadata.to_json).gsub("\n", '')
  
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true
    response = http.request(request)
  
    return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
  
    raise "Server error #{response.body}"
  end

# Update payment link
def update_payment_link(body, payment_link_id, api_key, cash_antifraud_metadata)
    uri = URI("https://sandbox.api.holacash.mx/v2/payment_link/#{payment_link_id}")
    request = Net::HTTP::Patch.new(uri, 'Content-Type' => 'application/json')
    request['X-Api-Client-Key'] = api_key
    request['X-Cash-Anti-Fraud-Metadata'] = Base64.encode64(cash_antifraud_metadata.to_json).gsub("\n", '')
    request.body = body.to_json
  
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true
    response = http.request(request)
  
    return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
  
    raise "Server error #{response.body}"
  end

# Your API Key, if key type is secret (starts with skt) do NOT share it or use it in the frontend
# for the purposes of this script you can setup an env variable called HOLACASH_API_KEY
api_key = ENV['HOLACASH_API_KEY']

# Antifraud metadata
# Check https://developers.holacash.mx/openapi/cashspa/#tag/tokenization for details on
# possible values on X-Cash-Anti-Fraud-Metadata
antifraud_metadata = { ip_address: '192.168.0.100', device_id: 'somedevice_123456', user_timezone: '-06:00' }

CREATE_PAYMENT_LINK_REQUEST = {
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

UPDATE_PAYMENT_LINK_REQUEST = {
    expiration_date: 1755921639,
    description: 'new description',
    status: 'disabled',
};

if __FILE__ == $PROGRAM_NAME
  puts 'Getting payment link list...'
  get_payment_link_list_response = get_payment_link_list(api_key, antifraud_metadata)
  puts "Get payment link list response: #{get_payment_link_list_response}"
  puts 'Creating payment link...'
  create_payment_link_response = create_payment_link(CREATE_PAYMENT_LINK_REQUEST, api_key, antifraud_metadata)
  puts "Create payment link response: #{create_payment_link_response}"
  payment_link_id = create_payment_link_response['id']
  puts 'Getting payment link details...'
  get_payment_link_response = get_payment_link(payment_link_id, api_key, antifraud_metadata)
  puts "Get payment link detail response: #{get_payment_link_response}"
  puts 'Updating payment link...'
  upate_payment_link_details_response = update_payment_link(UPDATE_PAYMENT_LINK_REQUEST, payment_link_id, api_key, antifraud_metadata)
  puts "Update payment link response: #{upate_payment_link_details_response}"
end
