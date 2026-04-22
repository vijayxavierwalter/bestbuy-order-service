'use strict'

const crypto = require('crypto')
global.crypto = crypto

const { MongoClient } = require('mongodb')

let ordersCollection
let mongoClient

async function getOrdersCollection() {
  if (ordersCollection) return ordersCollection

  const mongoUrl = process.env.MONGO_URL || 'mongodb://mongodb:27017'
  const dbName = process.env.MONGO_DB_NAME || 'bestbuy'
  const collectionName = process.env.MONGO_COLLECTION_NAME || 'orders'

  mongoClient = new MongoClient(mongoUrl)
  await mongoClient.connect()

  const db = mongoClient.db(dbName)
  ordersCollection = db.collection(collectionName)

  return ordersCollection
}

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    try {
      const collection = await getOrdersCollection()
      const order = request.body

      const count = await collection.countDocuments()
      const newOrder = {
        orderId: order.orderId || String(count + 1),
        customerId: order.customerId,
        items: order.items || [],
        status: order.status ?? 0
      }

      await collection.insertOne(newOrder)
      reply.code(201).send(newOrder)
    } catch (error) {
      request.log.error(error)
      reply.code(500).send({ message: 'Failed to create order' })
    }
  })

  fastify.get('/', async function (request, reply) {
    try {
      const collection = await getOrdersCollection()
      const orders = await collection.find({}, { projection: { _id: 0 } }).toArray()
      return orders
    } catch (error) {
      request.log.error(error)
      reply.code(500).send({ message: 'Failed to fetch orders' })
    }
  })

  fastify.get('/:id', async function (request, reply) {
    try {
      const collection = await getOrdersCollection()
      const order = await collection.findOne(
        { orderId: request.params.id },
        { projection: { _id: 0 } }
      )

      if (!order) {
        return reply.code(404).send({ message: 'Order not found' })
      }

      return order
    } catch (error) {
      request.log.error(error)
      reply.code(500).send({ message: 'Failed to fetch order' })
    }
  })

  fastify.put('/', async function (request, reply) {
    try {
      const collection = await getOrdersCollection()
      const updatedOrder = request.body

      const existingOrder = await collection.findOne({ orderId: updatedOrder.orderId })

      if (!existingOrder) {
        return reply.code(404).send({ message: 'Order not found' })
      }

      await collection.updateOne(
        { orderId: updatedOrder.orderId },
        { $set: updatedOrder }
      )

      const savedOrder = await collection.findOne(
        { orderId: updatedOrder.orderId },
        { projection: { _id: 0 } }
      )

      return savedOrder
    } catch (error) {
      request.log.error(error)
      reply.code(500).send({ message: 'Failed to update order' })
    }
  })

  fastify.get('/health', async function () {
    const appVersion = process.env.APP_VERSION || '0.1.0'
    return { status: 'ok', version: appVersion }
  })
}