import Product from '../models/Product.js'
import fs from 'fs'
import path from 'path'

// ✅ GET - Tous les produits

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, priceMin, priceMax, stockMin, featured, highlighted, page = 1, limit = 12 } = req.query

    const filter = {}

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    if (category) {
      filter.category = category
    }

    if (featured === 'true') {
      filter.isFeatured = true
    }
    
    if (highlighted === 'true') {
      filter.isHighlighted = true
    }
    

    if (priceMin || priceMax) {
      filter.price = {}
      if (priceMin) filter.price.$gte = parseFloat(priceMin)
      if (priceMax) filter.price.$lte = parseFloat(priceMax)
    }

    if (stockMin) {
      filter.stock = { $gte: parseInt(stockMin) }
    }

    const currentPage = parseInt(page)
    const itemsPerPage = parseInt(limit)

    const total = await Product.countDocuments(filter)

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)

    res.json({
      products,
      total,
      page: currentPage,
      limit: itemsPerPage
    })
  } catch (err) {
    console.log('FILTRAGE FINAL :', filter)
    console.error('Erreur récupération produits :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' })
    }

    // ✅ Supprimer chaque image du disque
    product.images.forEach(imagePath => {
      const fullPath = path.join(process.cwd(), imagePath)
      fs.unlink(fullPath, err => {
        if (err) {
          console.warn(`Image non supprimée : ${fullPath}`, err.message)
        }
      })
    })

    await product.deleteOne()
    res.json({ message: 'Produit supprimé avec ses images' })
  } catch (err) {
    console.error('Erreur suppression produit :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}


export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category, imagesToKeep = [] } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' })

    product.name = name
    product.price = price
    product.description = description
    product.stock = stock
    product.category = category
    product.isFeatured = req.body.isFeatured === 'true'
    product.isHighlighted = req.body.isHighlighted === 'true'

    // 🧼 Forcer imagesToKeep en tableau (et garder chemin complet)
    const kept = Array.isArray(imagesToKeep)
      ? imagesToKeep
      : typeof imagesToKeep === 'string'
        ? [imagesToKeep]
        : []

    // ❌ Supprimer les images supprimées physiquement
    const imagesToDelete = product.images.filter(img => !kept.includes(img))
    imagesToDelete.forEach(img => {
      const filePath = img.startsWith('uploads/') ? img : `uploads/${img}`
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    })

    // ✅ Conserver + ajouter nouvelles avec le bon chemin
    const newImagePaths = req.files?.map(file => `uploads/${file.filename}`) || []
    product.images = [...kept, ...newImagePaths]

    await product.save()
    res.json({ message: 'Produit mis à jour', product })
  } catch (err) {
    console.error('Erreur modification produit', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}


// ✅ POST - Créer un produit avec upload d'images (max 4)
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Veuillez ajouter au moins une image' })
    }

    const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/'))

    const product = new Product({
      name,
      price,
      stock,
      category,
      description,
      images: imagePaths,
      isFeatured: req.body.isFeatured === 'true',
      isHighlighted: req.body.isHighlighted === 'true'
    })

    await product.save()
    res.status(201).json(product)
  } catch (err) {
    console.error('Erreur création produit :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
