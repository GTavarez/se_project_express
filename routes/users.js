const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateProfileUpdate } = require("../middlewares/validate");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateProfileUpdate, updateUserProfile);

module.exports = router;
