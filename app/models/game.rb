class Game < ApplicationRecord

	def start_new_game
		@game_levels = { a1: {num_colors:3, shades_per_color:3, time_per_letter_segment: 240, min_letters_per_word: 3, max_letters_per_word: 9}, a2:{num_colors:5, shades_per_color:3, time_per_letter_segment: 210, min_letters_per_word: 5, max_letters_per_word: 10}}
		@level = @game_levels[:a1]		
		response = {}
		all_colors_hex = []
		all_colors_rgb = []
		letters = get_letters
		two_colors = get_random_colors(2, nil)
		two_colors_hex = two_colors[0]
		two_colors_rgb = two_colors[1]
		in_between_color_hex = get_in_between_color(two_colors_rgb)[0]
		additional_colors = get_random_colors(@level[:num_colors]-2, two_colors_rgb)
		additional_colors_hex = additional_colors[0]
		additional_colors_hex.length.times.map {|i| all_colors_hex.push([additional_colors_hex[i]])}
		two_colors_hex.length.times do |i|
			all_colors_hex.push([two_colors_hex[i]])
		end
		puts "this is all_colors_hex"
		puts all_colors_hex.inspect
		additional_colors_rgb = additional_colors[1]		
		additional_colors_rgb.length.times.map {|i| all_colors_rgb.push(additional_colors_rgb[i])}
		two_colors_rgb.length.times do |i|
			all_colors_rgb.push(two_colors_rgb[i])
		end
		puts "test"
		puts all_colors_rgb.inspect
		if ( (@level[:shades_per_color] - 1) > 0 )
			len = all_colors_rgb.length
			len.times do |i|
				similar_colors_temp = get_similar_colors(all_colors_rgb[i],@level[:shades_per_color] - 1)
				similar_colors_temp[0].length.times.map {|j| all_colors_hex[i].push(similar_colors_temp[0][j])}
			end
		end
		puts "tthis is all_colors_rgb after similar colors are added"
		puts all_colors_rgb.inspect
		puts "this is all colors hex"
		puts all_colors_hex.inspect
		all_colors_hex.length.times do |i|
			all_colors_hex[i] = order_hex_colors(all_colors_hex[i])
		end
		puts "this is all colors hex after sorting"
		puts all_colors_hex.inspect
		#in_between_colors_for_similar_colors_hex = create_in_between_colors_for_similar_colors(similar_colors_rgb)
		response["correctPair"] = two_colors_hex
		response["correctMixedColor"] = in_between_color_hex
		response["allColors"] = mix_up(all_colors_hex)
		response["letters"] = letters
		#response["spectrumsEnds"] = [in_between_colors_for_similar_colors_hex[2],in_between_colors_for_similar_colors_hex[3]]
		#response["spectrumsColor"] = in_between_colors_for_similar_colors_hex[1]
		#response["spectrumsMixes"] = order_hex_colors(in_between_colors_for_similar_colors_hex[0])
		return response
	end

	def get_letters
		words = ["cat","phone","yellow"]
		chosen_word = words[rand(words.length)]
		letters = chosen_word.split("")
		return letters
	end

	def get_random_colors(num_of_colors, colors_to_avoid_param)
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
				color_temp = create_random_rgb_color
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
		return [colors_hex,colors_rgb]
	end

	def create_random_rgb_color
		channel = Random.new
		color = 3.times.map{channel.rand(146)+80}
		return color
	end

	def get_in_between_color(color_ends)
		color1 = color_ends[0]
		color2 = color_ends[1]
		slice = []
		alpha = 0.5
		slice[0] = color1[0] * alpha + (1-alpha) * color2[0]
		slice[1] = color1[1] * alpha + (1-alpha) * color2[1]
		slice[2] = color1[2] * alpha + (1-alpha) * color2[2]
		hex = "#%02X%02X%02X" % [slice[0],slice[1],slice[2]]
		return [hex, [slice[0],slice[1],slice[2]]]
	end

	def get_similar_colors(color, num_of_colors_in_spectrum)
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
		puts "this is colors_orig"
		puts colors_orig.inspect
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
		puts "this is mixed_arr"
		puts mixed_arr.inspect
		return mixed_arr
	end

	def order_hex_colors(colors_arr)
		arr = []
		arr = colors_arr.map {|color| color.clone}
		arr.sort_by! {|color| color.downcase}
		return arr
	end

	def create_in_between_colors_for_similar_colors(spects)
		puts spects.inspect
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