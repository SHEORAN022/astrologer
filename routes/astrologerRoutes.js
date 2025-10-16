// const express = require("express");
// const router = express.Router();
// const {
//   getAstrologers,
//   createAstrologer,
//   updateAstrologer,
//   deleteAstrologer,
// } = require("../controllers/astrologerController");

// router.get("/", getAstrologers);
// router.post("/", createAstrologer);
// router.put("/:id", updateAstrologer);
// router.delete("/:id", deleteAstrologer);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAstrologers,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
} = require("../controllers/astrologerController");

router.get("/", getAstrologers);
router.post("/", createAstrologer);
router.put("/:id", updateAstrologer);
router.delete("/:id", deleteAstrologer);

module.exports = router;
