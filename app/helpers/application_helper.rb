module ApplicationHelper
  def add_script(src)
    @scripts ||= []
    @scripts << src
  end
  
  def more_scripts
    @scripts ||= []
    @scripts.map{|s| "<script src='#{s}'></script>" }.join("\n").html_safe
  end
  
  def commas(number)
    number.to_s.chars.to_a.reverse.each_slice(3).map(&:join).join(",").reverse
  end
end
