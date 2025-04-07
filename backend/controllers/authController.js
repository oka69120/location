import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' })

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}


export const createUser = async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }

  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' })

    const newUser = new User({ email, password, role })
    await newUser.save()
    res.status(201).json({ message: 'Utilisateur créé avec succès' })
  } catch (err) {
    console.error('Erreur création user :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password') // exclure le mot de passe
    res.json(users)
  } catch (err) {
    console.error('Erreur get users :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params

  // Empêcher suppression de soi-même
  if (req.user.userId === id) {
    return res.status(403).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' })
  }

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    res.json({ message: 'Utilisateur supprimé avec succès' })
  } catch (err) {
    console.error('Erreur suppression utilisateur :', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

