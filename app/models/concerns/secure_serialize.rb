require 'go_secure'

module SecureSerialize
  extend ActiveSupport::Concern

  include GoSecure::SerializeInstanceMethods
  
  module ClassMethods
    include GoSecure::SerializeClassMethods
  end
end