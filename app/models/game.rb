class Game < ApplicationRecord
	belongs_to :player

	def start_new_game
		@game_levels = { a1: {num_colors:3, shades_per_color:3, time_per_letter_segment: 240, min_letters_per_word: 3, max_letters_per_word: 9}, a2:{num_colors:5, shades_per_color:3, time_per_letter_segment: 210, min_letters_per_word: 5, max_letters_per_word: 10}}
		@level = @game_levels[:a1]		
		output = {}
		responses = []
		5.times do	
			response = {}
			goal_color = get_random_colors(1, 1, nil)
			goal_color_rgb = goal_color[0]
			goal_color_hex = goal_color[1] 
			response["goalColor"] = goal_color_hex[0]
			responses.push(response)
		end
		output["colors"] = responses
		letters = get_letters
		output["letters"] = letters
		output["numberOfX"] = 0
		output["points"] = 0
		return output
	end

	def get_letters
		words = ["cat","phone","yellow"]
		chosen_word = words[rand(words.length)]
		letters = chosen_word.split("")
		return letters
	end

	def get_random_colors(type, num_of_colors, colors_to_avoid_param)
		colors_rgb = []
		colors_hex = []
		if (!!colors_to_avoid_param && (colors_to_avoid_param.length > 0))
			colors_to_avoid = colors_to_avoid_param.length.times.map {|i| colors_to_avoid_param[i].clone }
		else
			colors_to_avoid = [[0,0,0]]
		end
		num_of_colors.times do
			cont = true
			color_temp = nil
			while (cont)
				cont = false
				color_temp = create_random_rgb_color(type)
				colors_to_avoid.length.times do |i|
					if ( (color_temp[0] == colors_to_avoid[i][0]) && (color_temp[1] == colors_to_avoid[i][1]) && (color_temp[2] == colors_to_avoid[i][2]) )
						cont = true
						break
					end 
				end # end colors_to_avoid.length.times do |i|
			end # end while
			colors_rgb.push(color_temp)
			colors_to_avoid.push(color_temp)
		end # end num_of_colors.times do 
		colors_hex = colors_rgb.length.times.map {|i| "#%02X%02X%02X" % [colors_rgb[i][0],colors_rgb[i][1],colors_rgb[i][2]]}
		return [colors_rgb, colors_hex]
	end

	def create_random_rgb_color(type)
		color = []
		if (type == 1)
			version = rand(13)
			if (version == 0)
				color.push(rand(150)+40)
				color.push(rand(100)+50)
				color.push(rand(60)+40)
			elsif (version == 1)
				color.push(rand(100)+50)
				color.push(rand(150)+40)
				color.push(rand(60)+40)
			elsif (version == 2)
				color.push(rand(100)+50)
				color.push(rand(60)+40)
				color.push(rand(150)+40)
			elsif (version == 3)
				color.push(rand(100)+50)
				color.push(rand(150)+40)
				color.push(rand(150)+40)
			elsif (version == 4)
				color.push(rand(150)+40)
				color.push(rand(100)+50)
				color.push(rand(150)+40)
			elsif (version == 5)
				color.push(rand(150)+40)
				color.push(rand(150)+40)
				color.push(rand(100)+50)
			elsif ((version == 6) || (version == 7))
				color.push(0)
				color.push(rand(130)+60)
				color.push(rand(130)+60)
			elsif ((version == 8) || (version == 9))
				color.push(rand(130)+60)
				color.push(0)
				color.push(rand(130)+60)
			elsif ((version == 10) || (version == 11))
				color.push(rand(130)+60)
				color.push(rand(130)+60)
				color.push(0)			
			elsif (version == 12)
				color = 3.times.map{rand(130)+60}
			end
		elsif (type == 2)
			color = 3.times.map{rand(145)+80}
		end
		return color
	end

	def get_answer_colors(answer)
		color1 = []
		color2 = []
		3.times do |i| 
			if (answer[i] < 40)
				factor = 0
			elsif (answer[i] < 120)
				factor = rand(answer[i])
			elsif ((answer[i] >= 120) && (answer[i] <= 150))
				factor = 10 + rand(71)
			elsif (answer[i] > 150)
				factor = rand(240-answer[i])
			end
			color1[i] = answer[i] - factor
			color2[i] = answer[i] + factor
		end
		hex1 = "#%02X%02X%02X" % [color1[0],color1[1],color1[2]]
		hex2 = "#%02X%02X%02X" % [color2[0],color2[1],color2[2]]
		return [hex1,hex2, [color1[0],color1[1],color1[2]], [color2[0],color2[1],color2[2]] ]
	end

	def get_shades(color, num_of_colors_in_spectrum)
		spectrum_hex = []
		spectrum_rgb = []
		less_than_80 = false
		greater_than_255 = false
		step = 0.15
		num_of_colors_in_spectrum.times do 
			random_number = rand(2)
			if ( (random_number == 0) && (!less_than_80 || greater_than_255) )
				factor = 1 - step
			elsif ( (random_number == 1) && !greater_than_255 )
				factor = 1 + step
			else
				factor = 1 - step
			end
			less_than_80 = false
			greater_than_255 = false
			test1 = (color[0] * factor).to_i
			test2 = (color[1] * factor).to_i
			test3 = (color[2] * factor).to_i
			test1 = (test1 >= 255) ? 255 : test1
			test2 = (test2 >= 255) ? 255 : test2
			test3 = (test3 >= 255) ? 255 : test3
			if ( (test1 < 80) && (test2 < 80) && (test3 < 80) )
				less_than_80 = true
			elsif ( (test1 == 255) || (test2 == 255) || (test3 == 255) )
				greater_than_255 = true
			end
			color_hex = "#%02X%02X%02X" % [test1,test2,test3]
			spectrum_hex.push(color_hex)
			spectrum_rgb.push([test1,test2,test3])
			step = step + 0.15
		end
		return [spectrum_hex,spectrum_rgb]
	end

	def mix_up(colors_orig)
		used = {}
		colors = colors_orig.map {|item| item.clone }
		mixed_arr = Array.new(colors.length)
		(mixed_arr.length-((mixed_arr.length/2).floor)).times do |i|
			popped = colors.pop
			ind = rand(mixed_arr.length)
			while (mixed_arr[ind] != nil)
				ind = rand(mixed_arr.length)
			end
			mixed_arr[ind] = popped
		end
		2.times do
			popped = colors.pop
			mixed_arr.length.times do |i|
				if (!mixed_arr[i])
					mixed_arr[i] = popped
					break
				end # end if
			end # end mixed_arr.length.times
		end # end 2.times do
		return mixed_arr
	end

	def order_hex_colors(colors_arr)
		arr = []
		arr = colors_arr.map {|color| color.clone}
		arr.sort_by! {|color| color.downcase}
		return arr
	end

	def create_in_between_colors_for_similar_colors(spects)
		arr = []
		ans = ""
		col1 = ""
		col2 = ""
		counter = 0
		ans_ind = rand(spects[0].length * spects[1].length)
		spects[0].length.times do |i|
			spects[1].length.times do |j|
				col = get_in_between_color([spects[0][i], spects[1][j]])[0]
				arr.push(col)
				if (ans_ind == counter)
					ans = col
					col1 = "#%02X%02X%02X" % [spects[0][i][0],spects[0][i][1],spects[0][i][2]]
					col2 = "#%02X%02X%02X" % [spects[1][j][0],spects[1][j][1],spects[1][j][2]]
				end
				counter = counter + 1
			end
		end
		return [arr,ans,col1,col2]
	end

end