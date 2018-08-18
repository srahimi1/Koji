# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

	Player.create(id: 0, email: "", cellphone: "")
	PaymentProvider.create(id: 1, name: "Stripe", main_url: "https://stripe.com", current_active: 0)
	PaymentProvider.create(id: 2, name: "Google Play Billing", main_url: "https://www.google.com", current_active: 1)