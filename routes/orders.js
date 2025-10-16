// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// } = require("../controllers/orderController");

// router.post("/", upload.single("file"), createOrder);
// router.get("/", getOrders);
// router.get("/:id", getOrderById);
// router.put("/:id", updateOrder);
// router.delete("/:id", deleteOrder);

// module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", upload.single("file"), createOrder);
router.put("/:id", upload.single("file"), updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
