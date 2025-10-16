// const Order = require("../models/Order");

// // Create Order
// exports.createOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.path : null;
//     const order = new Order({ ...req.body, fileUrl });
//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get All Orders
// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get Single Order
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ msg: "Order not found" });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update Order
// exports.updateOrder = async (req, res) => {
//   try {
//     const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete Order
// exports.deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//     res.json({ msg: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const Order = require("../models/Order");

// ✅ Get all orders (with optional search by customerName)
exports.getOrders = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.customerName = { $regex: search, $options: "i" }; // case-insensitive
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : null;
    const order = new Order({ ...req.body, fileUrl });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// ✅ Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

// ✅ Update order
exports.updateOrder = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : req.body.fileUrl;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fileUrl },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

// ✅ Delete order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};
