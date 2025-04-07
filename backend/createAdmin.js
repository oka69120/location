// createAdmin.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const email = 'admin@mail.com'
  const password = '123456'

  const exists = await User.findOne({ email })
  if (exists) {
    console.log('Admin déjà existant.')
    process.exit()
  }

  const user = new User({ email, password })
  await user.save()
  console.log('✅ Admin créé avec succès.')
  process.exit()
}

createAdmin()
