class ConfirmationCode < ApplicationRecord
  belongs_to :player


  def create(pid, type)
  	cc = ""
  	mthd = ""
  	case type
  	when 0
  		mthd = "email"
  	when 1
  		mthd = "cellphone"
  	end
  	8.times do 
  		sel = rand(3)
  		char = ""
  		case sel
  		when 0
  			char = (rand(25) + 65).chr
  		when 1
  			char = (rand(25) + 97).chr
  		when 2
  			char = rand(10).to_s
  		end
  		cc = "#{cc}#{char}"
  	end
  	player_cc = ConfirmationCode.find_by(player_id: pid)
  	if (!player_cc) 
  		player_cc = ConfirmationCode.create(player_id: pid, code: cc, method: mthd)
  	else 
  		player_cc.code = cc
  		player_cc["method"] = mthd
  	end
  	player_cc.save
  	return cc
  end






end
