'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('forgetpassword', 'ForgetPasswordController.store')
Route.put('resetpassword', 'ForgetPasswordController.update')

Route.group(() => {
  Route.get('users', 'UserController.index')

  Route.get('/files/:id', 'FileController.show')
  Route.post('/files', 'FileController.store')

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map([[['projects.store', ['Project']]]]))
  Route.resource('projects.tasks', 'TaskController').apiOnly()
}).middleware(['auth'])
