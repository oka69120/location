import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, required: true },

  address:        { type: String, required: true },
  eventLocation:  { type: String, required: true },
  eventType:      { type: String, enum: ['mariage', 'anniversaire', 'cocktail', 'autre'], required: true },

  clientType:     { type: String, enum: ['particulier', 'société'], required: true },
  companyName:    { type: String },

  startDate:      { type: Date, required: true },
  endDate:        { type: Date, required: true },
  message:        { type: String },

  products:       { type: [productSchema], required: true },
  totalPrice:     { type: Number, required: true },

  status:         { type: String, enum: ['nouvelle', 'en cours', 'traitée'], default: 'nouvelle' }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
