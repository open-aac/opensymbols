class AdminController < ApplicationController
  def login
  end

  def token_check
    render json: ExternalSource.confirm_user_token(params['secret'])
  end
end
