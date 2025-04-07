import Order from '../models/Order.js'

// ➕ Créer une nouvelle demande
export const createOrder = async (req, res) => {
  try {

    const {
      fullName,
      email,
      phone,
      address,
      eventLocation,
      eventType,
      clientType,
      startDate,
      endDate,
      products,
      totalPrice
    } = req.body

    // Vérification minimale des champs obligatoires
    if (
      !fullName || !email || !phone ||
      !address || !eventLocation || !eventType ||
      !clientType || !startDate || !endDate ||
      !products || products.length === 0 ||
      !totalPrice
    ) {
      return res.status(400).json({ error: 'Champs requis manquants ou invalides.' })
    }

    const order = new Order(req.body)
    await order.save()

    res.status(201).json({ message: 'Demande enregistrée avec succès', order })

  } catch (error) {
    console.error('❌ Erreur création commande :', error)
    res.status(400).json({ error: error.message || 'Erreur lors de l’enregistrement de la demande' })
  }
}


// 📄 Obtenir toutes les demandes (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Erreur récupération commandes :', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
