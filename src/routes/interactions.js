const express = require("express");
const router = express.Router();

const interactionsAccessLayer = require("../models/interactionsAccessLayer");

const {
  validateInt,
  validateInteractionResponseTextBody,
  validateInteractionsReviewIdBody,
} = require("../validators/idValidation");
const { validationResult } = require("express-validator");

const auth = require("../middleware/auth");

// POST /api/interactions/respond — Respond to a review
router.post(
  "/respond",
  auth,
  validateInteractionsReviewIdBody,
  validateInteractionResponseTextBody,
  async (req, res) => {
    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { reviewId, responseText } = req.body;
      const interaction = await interactionsAccessLayer.createInteraction({
        reviewId,
        responseText,
        userId: req.user_id,
      });

      if (!interaction) {
        return res.status(404).json({ error: "Review not found" });
      }

      console.log(interaction);
      res.status(200).json({
        message: "Response saved successfully",
        interaction: interaction[0],
      });
    } catch (err) {
      console.error("Error responding to review:", err);
      res
        .status(500)
        .json({ error: "Server error while responding to review" });
    }
  },
);

// GET /api/interactions -- get all interactions by user_id
router.get("/", auth, async (req, res) => {
  try {
    // Get reviews with filters, pagination and sorting
    // TODO - replace this function with getFilteredReviews when the function works
    // To view code to build that function, see commit history
    const interactions = await interactionsAccessLayer.getInteractionByUserId(
      req.user_id,
    );

    res.status(200).json({
      interactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/interactions/responseId/responseId -- get interaction by response_id
router.get(
  "/responseId/:responseId",
  validateInt("responseId"),
  async (req, res) => {
    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const interaction = await interactionsAccessLayer.getInteractionById(
        req.params.responseId,
      );

      if (!interaction) {
        return res.status(404).json({ error: "Interaction not found" });
      }
      res.status(200).json(interaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get Interaction" });
    }
  },
);

// GET /api/interactions/reviewId/reviewId -- get interaction by review_id
router.get("/reviewId/:reviewId", validateInt("reviewId"), async (req, res) => {
  // Extract validation error into a result object
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const interaction = await interactionsAccessLayer.getInteractionByReviewId(
      req.params.reviewId,
    );
    if (!interaction) {
      return res.status(404).json({ error: "interaction not found" });
    }
    res.status(200).json(interaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get interaction by review id" });
  }
});

// PUT /api/interactions/responseId -- update response text
router.put(
  "/:responseId",
  validateInt("responseId"),
  validateInteractionResponseTextBody,
  async (req, res) => {
    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ result: result.array() });
    }

    try {
      const { responseText } = req.body;
      const interaction = await interactionsAccessLayer.updateResponseText({
        response_id: req.params.responseId,
        responseText,
      });

      if (!interaction) {
        return res.status(404).json({ error: "Interaction not found" });
      }
      res.status(200).json(interaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update response text" });
    }
  },
);

// DELETE /api/interactions/responseId -- delete dispute
router.delete("/:responseId", validateInt("responseId"), async (req, res) => {
  // Extract validation error into a result object
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ result: result.array() });
  }

  try {
    const interaction = await interactionsAccessLayer.deleteInteraction(
      req.params.responseId,
    );

    if (!interaction) {
      return res.status(404).json({ error: "Interaction not found" });
    }
    res.status(200).json(interaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete interaction" });
  }
});

module.exports = router;
