'use strict'

const orders = []

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    const order = request.body

    const newOrder = {
      orderId: order.orderId || String(orders.length + 1),
      customerId: order.customerId,
      items: order.items || [],
      status: order.status || 0
    }

    orders.push(newOrder)
    reply.code(201).send(newOrder)
  })

  fastify.get('/', async function (request, reply) {
    return orders
  })

  fastify.get('/:id', async function (request, reply) {
    const order = orders.find(o => o.orderId === request.params.id)

    if (!order) {
      reply.code(404).send({ message: 'Order not found' })
      return
    }

    return order
  })

  fastify.put('/', async function (request, reply) {
    const updatedOrder = request.body
    const index = orders.findIndex(o => o.orderId === updatedOrder.orderId)

    if (index === -1) {
      reply.code(404).send({ message: 'Order not found' })
      return
    }

    orders[index] = {
      ...orders[index],
      ...updatedOrder
    }

    return orders[index]
  })

  fastify.get('/health', async function (request, reply) {
    const appVersion = process.env.APP_VERSION || '0.1.0'
    return { status: 'ok', version: appVersion }
  })
}