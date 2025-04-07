import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api/categories', categoryRoutes)

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connecté à la base : ${mongoose.connection.name}`)

    // Protection contre le port déjà utilisé
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé. Change-le dans .env ou libère-le.`)
        process.exit(1)
      } else {
        console.error('❌ Erreur serveur :', err)
      }
    })
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err.message)
  })
