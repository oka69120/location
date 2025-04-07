import express from 'express'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById 
} from '../controllers/productController.js'

import upload from '../middleware/upload.js'
import { verifyAdmin, hasRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// 🔽 GET tous les produits
router.get('/', getAllProducts)

// 🔽 POST nouveau produit (max 4 fichiers)
router.post(
  '/',
  verifyAdmin,
  hasRole(['admin', 'manager']),
  upload.array('images', 4),
  createProduct
)

// 🔽 PUT modifier produit par ID (avec fichiers en option)
router.put(
  '/:id',
  verifyAdmin,
  hasRole(['admin', 'manager']),
  upload.array('images', 4),
  updateProduct
)

// 🔽 DELETE supprimer produit + images
router.delete(
  '/:id',
  verifyAdmin,
  hasRole(['admin', 'manager']),
  deleteProduct
)

router.get('/:id', getProductById)

export default router
