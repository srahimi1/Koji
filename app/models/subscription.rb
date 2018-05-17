class Subscription < ApplicationRecord
  belongs_to :player
  has_one :payment_provider, dependent: :destroy
end
