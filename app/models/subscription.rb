class Subscription < ApplicationRecord
  belongs_to :player
  has_one :payment_provider

  require "stripe"

  def self.subscription_enroll(token_id, token_email)

    Stripe.api_key = "sk_test_IKTtVCpDqEbM7GV8WVY56ADM"
  	
    customer = Stripe::Customer.create(
  		:email => token_email,
  		:source => token_id
  	)

  	subscription = Stripe::Subscription.create(
  		:customer => customer.id,
  		:items => [{plan: 'plan_CwIh81FZdTOEJH'}]
  	)

  	result = []
  	if (!!subscription.id)
  		result = [1, subscription.id, subscription.customer]
  	else
  		result = [0]
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
