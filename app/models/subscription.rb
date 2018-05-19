class Subscription < ApplicationRecord
  belongs_to :player
  has_one :payment_provider, dependent: :destroy

  require "stripe"

  def self.subscription_enroll(token_id, token_email)
	puts " "
	puts " "
	puts " "
  	puts " "
  	puts "this is token id"
  	puts token_id
  	puts token_id.to_s
  	puts token_id.inspect
  	puts " "
  	puts " "
  	puts " "
  	puts " "
  	puts token_email
  	puts token_email.to_s
  	puts token_email.inspect




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
