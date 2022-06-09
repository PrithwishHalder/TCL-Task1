const express = require("express");
const router = express.Router();
const { todolistFetch } = require("../controllers/todolistController");

router.get("/", todolistFetch);

module.exports = router;
