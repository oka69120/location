import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true, validate: [arr => arr.length <= 4, '{PATH} ne peut pas dépasser 4 images'] },
  category: { type: String, default: 'autre' },
  isFeatured: { type: Boolean, default: false },
  isHighlighted: { type: Boolean, default: false },
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
