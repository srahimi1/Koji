class Game < ApplicationRecord

	def create_colors
		response = {}
		response_answer = create_answer_color
		gradient_answer = response_answer[0]
		color1_answer_hex = response_answer[1]
		color2_answer_hex = response_answer[2]
		other_ends = get_other_ends(response_answer[3],response_answer[4])
		response["answer"] = {}
		response["answer"]["ends"] = [color1_answer_hex,color2_answer_hex]
		response["answer"]["selectedColor"] = gradient_answer[Random.new.rand(gradient_answer.length)]
		response["otherEnds"] = other_ends
		return response
	end

	def create_answer_color
		color_ends = []
		2.times do 
			color_ends.push(get_random_rgb_color)
		end
		color1_hex = "#%02X%02X%02X" % [color_ends[0][0],color_ends[0][1],color_ends[0][2]]
		color2_hex = "#%02X%02X%02X" % [color_ends[1][0],color_ends[1][1],color_ends[1][2]]
		gradient = create_gradient_from_two_colors(color_ends,15)
		gradient.push(color1_hex)
		gradient.unshift(color2_hex)
		return [gradient, color1_hex, color2_hex, color_ends[0], color_ends[1]]
	end

	def get_random_rgb_color
		component = Random.new
		color = 3.times.map{component.rand(256)}
		return color
	end

	def create_gradient_from_two_colors(color_ends, steps)
		gradient = []
		color1 = color_ends[0]
		color2 = color_ends[1]
		alpha = 0.0
		(0...steps).each do |i|
			slice = []
			alpha = alpha + (1.0/steps)
			slice[0] = color1[0] * alpha + (1-alpha) * color2[0]
			slice[1] = color1[1] * alpha + (1-alpha) * color2[1]
			slice[2] = color1[2] * alpha + (1-alpha) * color2[2]
			hex = "#%02X%02X%02X" % [slice[0],slice[1],slice[2]]
			gradient.push(hex)
		end
		return gradient
	end

	def shift_color(color, alpha)
		slice = []
		slice[0] = (1-alpha) * color[0]
		slice[1] = (1-alpha) * color[1]
		slice[2] = (1-alpha) * color[2]
		color_hex = "#%02X%02X%02X" % [slice[0],slice[1],slice[2]]
		return color_hex
	end

	def get_other_ends(color1, color2)
		others = []
		step = 0.0
		8.times do
			step = step + 0.1 
			temp = []
			temp.push(shift_color(color1,step))
			temp.push(shift_color(color2,step))
			others.push(temp)
		end
		return others
	end

end