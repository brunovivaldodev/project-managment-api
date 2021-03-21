'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = User.create(data)

    return user
  }

  async index ({ response }) {
    const user = await User.all()

    return user
  }
}

module.exports = UserController
