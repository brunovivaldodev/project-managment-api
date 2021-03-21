'use strict'
const crypto = require('crypto')
const User = use('App/Models/User')
const moment = require('moment')

const Mail = use('Mail')

class ForgetPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('brunolumeca@live.com')
            .subject('Recuperação de senha')
        }
      )
    } catch (error) {
      console.log(error)
      return response.status(error.status).json({ error: 'Email invalido' })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)
      if (tokenExpired) {
        return response.status(401)
          .json({ error: 'O tempo de resetar a palavra passe expirou.Pedir no reset de senha' })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      console.log(error)
      return response.status(error.status).json({ error: 'Token Invalido' })
    }
  }
}

module.exports = ForgetPasswordController
