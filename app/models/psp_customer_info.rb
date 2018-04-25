class PspCustomerInfo < ApplicationRecord
  belongs_to :player
  belongs_to :payment_service_provider
end
