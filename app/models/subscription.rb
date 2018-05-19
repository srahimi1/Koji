class Subscription < ApplicationRecord
  belongs_to :player
  has_one :payment_provider, dependent: :destroy

  require "stripe"

  def self.subscription_enroll(token_id, token_email)

  	customer = Stripe::Customer.create(
  		:email => token_email,
  		:source => token_id
  	)

  	subscription = Stripe::Subscription.create(
  		:customer => customer.id,
  		:items => [{plan: 'plan_CscHlXCt8cGalL'}]
  	)

  end


end
