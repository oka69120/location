import express from 'express'
import { login } from '../controllers/authController.js'
import { createUser, deleteUser  } from '../controllers/authController.js'
import { verifyAdmin, hasRole } from '../middleware/authMiddleware.js'
import { getAllUsers } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)

router.post('/users', verifyAdmin, createUser)

// ✅ Route pour obtenir tous les utilisateurs (admin uniquement)
router.get('/users', verifyAdmin, hasRole(['admin']), getAllUsers)

router.delete('/users/:id', verifyAdmin, hasRole(['admin']), deleteUser)

router.delete('/users/:id', verifyAdmin, hasRole(['admin']), deleteUser)

export default router
