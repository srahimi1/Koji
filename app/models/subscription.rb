class Subscription < ApplicationRecord
  belongs_to :player
  has_one :payment_provider

  require "stripe"

  def self.subscription_enroll(token_id, token_email)

    Stripe.api_key = "sk_test_IKTtVCpDqEbM7GV8WVY56ADM"
  	result = []
    result = [0]
    begin

      customer = Stripe::Customer.create(
    		:email => token_email,
    		:source => token_id
    	)

    	subscription = Stripe::Subscription.create(
    		:customer => customer.id,
    		:items => [{plan: 'plan_CwIh81FZdTOEJH'}]
    	)

    rescue Stripe::CardError => e
      body = e.json_body
      err = body[:error]

      puts "Status is #{e.http_status}"
      puts "Type is #{err[:type]}"
      puts "Charge ID is: #{err[:charge]}"
      puts "#{err[:code]}" if err[:code]
      puts "Decline code is #{err[:decline_code]}" if err[:decline_code]
      puts "Param is: #{err[:param]}" if err[:param]
      puts "Message is: #{err[:message]}" if err[:message]
    
       if err[:charge]
        charge_id = err[:charge]
      else
        charge_id = ""
      end

      if err[:code]
        code = err[:code]
      else
        code = ""
      end

      if err[:decline_code]
        decline_code = err[:decline_code]
      else
        decline_code = ""
      end

      if err[:message]
        message = err[:message]
      else
        message = ""
      end

      PaymentFailure.create(email: token_email, stripe_status: e.http_status, stripe_type: err[:type], charge_id: charge_id, stripe_code: code, decline_code: decline_code, message: message)

    rescue Stripe::RateLimitError => e
      puts "Too many requests made to the API too quickly"
    rescue Stripe::InvalidRequestError => e
      puts "Invalid parameters were supplied to Stripe's API"
    rescue Stripe::AuthenticationError => e
      puts "Authentication with Stripe's API failed"
    rescue Stripe::APIConnectionError => e
      puts "Network communication with Stripe failed"
    rescue Stripe::StripeError => e
      puts "Generic Stripe error"
    rescue
      puts "An error not related to Stripe occurred"
    else
      if (!!subscription.id)
        result = [1, subscription.id, subscription.customer]
      end
    end
    return result
  end

  def self.cancel_subscription(subscription_id)
    subs = Stripe::Subscription.retrieve(subscription_id)
    subs.delete
    result = 0
    if (subs.id == subscription_id)
      result = 1
    end
    return result
  end


end
