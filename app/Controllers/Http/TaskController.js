'use strict'

const Task = use('App/Models/Task')
class TaskController {
  async index ({ params }) {
    const task = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .fetch()

    return task
  }

  async store ({ params, request }) {
    const { user_id, title, due_date, file_id } = request.all()

    const task = Task.create({
      user_id,
      title,
      due_date,
      file_id,
      project_id: params.projects_id
    })

    return task
  }

  async show ({ params }) {
    const task = await Task.findOrFail(params.id)

    return task
  }

  async update ({ params, request }) {
    const { user_id, title, description, due_date, file_id } = request.all()
    const task = Task.findOrFail(params.id)

    task.merge({
      user_id,
      title,
      description,
      due_date,
      file_id,
      project_id: params.projects_id
    })
    await task.save()
    return task
  }

  async destroy ({ params }) {
    const task = Task.findOrFail(params.id)

    await task.delete()
  }
}

module.exports = TaskController
