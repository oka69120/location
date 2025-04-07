import Category from '../models/Category.js'
import Product from '../models/Product.js'

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    const existing = await Category.findOne({ name })
    if (existing) return res.status(400).json({ error: 'Catégorie existante' })

    const category = new Category({ name })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ error: 'Erreur création' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    )
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable' })
    res.json({ message: 'Catégorie supprimée' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression' })
  }
}
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.find()
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])

    const result = categories.map(cat => {
      const match = counts.find(c => c._id === cat.name)
      return {
        _id: cat._id,
        name: cat.name,
        count: match ? match.count : 0
      }
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
