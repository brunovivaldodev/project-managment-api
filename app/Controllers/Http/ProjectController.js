'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ request, response }) {
    const projects = await Project.query()
      .with('user')
      .fetch()
    return projects
  }

  async store ({ request, auth }) {
    const { title, description } = request.all()
    const user_id = auth.user.id

    const project = await Project.create({ title, description, user_id })

    return project
  }

  async show ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('tasks')

    return project
  }

  async update ({ request, params }) {
    const data = request.all()
    const project = await Project.findOrFail(params.id)

    await project.merge(data)
    await project.save()
    return project
  }

  async destroy ({ params }) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
  }
}

module.exports = ProjectController
