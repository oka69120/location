import express from 'express'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js'

import { verifyAdmin, hasRole } from '../middleware/authMiddleware.js'
import { getCategoriesWithCount } from '../controllers/categoryController.js'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', verifyAdmin, hasRole(['admin']), createCategory)
router.put('/:id', verifyAdmin, hasRole(['admin']), updateCategory)
router.delete('/:id', verifyAdmin, hasRole(['admin']), deleteCategory)
router.get('/with-count', getCategoriesWithCount)

export default router
