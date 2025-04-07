import express from 'express'
import { createOrder, getAllOrders } from '../controllers/orderController.js'
import { verifyAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Route publique : création d'une commande
router.post('/', createOrder)

// Route admin : consultation des demandes
router.get('/', verifyAdmin, getAllOrders)

export default router
