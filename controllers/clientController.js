
// const Client = require('../models/Client');

// // ✅ Get all clients (with optional search by name)
// exports.getClients = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};
//     if (search) {
//       query.name = { $regex: search, $options: "i" }; // case-insensitive search
//     }
//     const clients = await Client.find(query).sort({ createdAt: -1 });
// // const Client = require("../models/Client");

// // // Create Client
// // exports.createClient = async (req, res) => {
// //   try {
// //     const client = new Client(req.body);
// //     await client.save();
// //     res.status(201).json(client);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // // Get All Clients
// // exports.getClients = async (req, res) => {
// //   try {
// //     const clients = await Client.find().sort({ createdAt: -1 });
// //     res.json(clients);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // // Get Single Client
// // exports.getClientById = async (req, res) => {
// //   try {
// //     const client = await Client.findById(req.params.id);
// //     if (!client) return res.status(404).json({ message: "Client not found" });
// //     res.json(client);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // // Update Client
// // exports.updateClient = async (req, res) => {
// //   try {
// //     const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
// //       new: true,
// //     });
// //     res.json(updated);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // // Delete Client
// // exports.deleteClient = async (req, res) => {
// //   try {
// //     await Client.findByIdAndDelete(req.params.id);
// //     res.json({ message: "Client deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// const Client = require('../models/Client');

// // ✅ Get all clients
// exports.getClients = async (req, res) => {
//   try {
//     const clients = await Client.find().sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch clients', error });
//   }
// };

// // ✅ Create a new client
// exports.createClient = async (req, res) => {
//   try {
//     const { name, email, phone, dob, gender, location, notes } = req.body;
//     const newClient = new Client({ name, email, phone, dob, gender, location, notes });
//     await newClient.save();
//     res.status(201).json(newClient);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to create client', error });
//   }
// };

// // ✅ Update client
// exports.updateClient = async (req, res) => {
//   try {
//     const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to update client', error });
//   }
// };

// // ✅ Delete client
// exports.deleteClient = async (req, res) => {
//   try {
//     await Client.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Client deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete client', error });
//   }
// };

const Client = require("../models/Client");

// GET all clients
exports.getClients = async (req, res) => {
  try {
    const search = req.query.search || "";
    const clients = await Client.find({ name: { $regex: search, $options: "i" } });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add client
exports.addClient = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newClient = new Client(req.body);
    await newClient.save();
    res.json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update client
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ msg: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
const Client = require('../models/Client');

// ✅ Get all clients (with optional search by name)
exports.getClients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }
    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients', error });
  }
};

// ✅ Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, location, notes } = req.body;
    const newClient = new Client({ name, email, phone, dob, gender, location, notes });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create client', error });
  }
};

// ✅ Update client
exports.updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update client', error });
  }
};

// ✅ Delete client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client', error });
  }
};
