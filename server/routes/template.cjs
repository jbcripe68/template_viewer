const router = require("express").Router();
const { getTemplatePage } = require("../controllers/templateController.cjs");

router.route("/get-page").get(getTemplatePage);

module.exports = router;
