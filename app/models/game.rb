class Game < ApplicationRecord

	def create_colors
		response = {}
		steps = 9;
		response_answer = create_answer_color(steps)
		gradient_answer = response_answer[0]
		color1_answer_hex = response_answer[1]
		color2_answer_hex = response_answer[2]
		other_ends = get_other_ends(response_answer[3],response_answer[4],4)
		response["answer"] = {}
		response["answer"]["ends"] = [color1_answer_hex,color2_answer_hex]
		response["answer"]["selectedColor"] = gradient_answer[Random.new.rand(gradient_answer.length)]
		response["answer"]["gradient"] = gradient_answer
		response["otherEnds"] = other_ends
		response["gradientSteps"] = steps
		response["mixedUpEnds"] = mix_up(color1_answer_hex, color2_answer_hex, other_ends)
		response["organizedEnds"] = organize_ends([color1_answer_hex, color2_answer_hex], other_ends)
		return response
	end

	def create_answer_color(steps)
		color_ends = []
		2.times do 
			color_ends.push(get_random_rgb_color)
		end
		color1_hex = "#%02X%02X%02X" % [color_ends[0][0],color_ends[0][1],color_ends[0][2]]
		color2_hex = "#%02X%02X%02X" % [color_ends[1][0],color_ends[1][1],color_ends[1][2]]
		gradient = create_gradient_from_two_colors(color_ends,steps)
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
		steps.times do |i|
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

	def shift_color(color, alpha_arg)
		slice = []
		rand_num = Random.new.rand(2)
		alpha = (rand_num == 1) ? (0 - alpha_arg) : alpha_arg
		factor = 1 + alpha
		if (  ((factor * color[0]) > 255) || ((factor * color[1]) > 255) || ((factor * color[2]) > 255) )
			factor = 1 - alpha
		end
		slice[0] = factor * color[0]
		slice[1] = factor * color[1]
		slice[2] = factor * color[2]
		color_hex = "#%02X%02X%02X" % [slice[0],slice[1],slice[2]]
		return color_hex
	end

	def get_other_ends(color1, color2, steps)
		others = []
		step = 0.0
		alpha = 1.0/steps
		steps.times do
			step = step + alpha  
			temp = []
			temp.push(shift_color(color1,step))
			temp.push(shift_color(color2,step))
			others.push(temp)
		end
		return others
	end

	def mix_up(end1, end2, ends_arr)
		temp_arr = []
		ends_arr.length.times do |i|
			temp_arr.push(ends_arr[i][0])
			temp_arr.push(ends_arr[i][1])
		end
		temp_arr.push(end1)
		temp_arr.push(end2)
		ind_hash = {}
		mixed_arr = []
		temp_arr.length.times do |i|
			ind_hash[i] = 1
		end
		random_number_maker = Random.new
		len = ind_hash.length
		while (len > 0) do
			keys_arr = ind_hash.keys
			random_number = random_number_maker.rand(keys_arr.length)
			mixed_arr.push(temp_arr[keys_arr[random_number].to_i])
			ind_hash.delete(keys_arr[random_number])
			len = ind_hash.length
		end
		mixed_arr.sort_by! {|color| color.downcase }
		return mixed_arr
	end

	def organize_ends(color_ans, other)
		arr = []
		other[0].length.times do |i|
			temp_arr = []
			other.length.times do |j|
				temp_arr.push(other[j][i])
			end
			temp_arr.push(color_ans[i])
			temp_arr.sort_by! {|color| color.downcase}
			temp_arr.length.times do |j|
				arr.push(temp_arr[j])
			end
		end
		return arr
	end

end