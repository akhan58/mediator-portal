const express = require("express");
const router = express.Router();
const businessAccessLayer = require("../models/businessesAccessLayer");

const auth = require("../middleware/auth");

// POST /api/business - create the business profile
router.post("/", auth, async (req, res) => {
  const {
    businessName,
    facebookPageId,
    googlePlaceId,
    trustpilotBusinessUnitId,
    yelpBusinessId,
  } = req.body;

  if (!businessName) {
    return res.status(400).json({ error: "Business name is required" });
  }

  try {
    const business = await businessAccessLayer.createBusiness({
      businessName,
      userId: req.user_id, // From auth middleware
      facebookPageId,
      googlePlaceId,
      trustpilotBusinessUnitId,
      yelpBusinessId,
    });

    res.status(201).json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/business - Get the business profile
router.get("/", auth, async (req, res) => {
  try {
    const business = await businessAccessLayer.getBusinessByUserId(req.user_id); //From auth middleware

    if (!business) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    res.status(200).json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/business - Update business platform IDs
router.put("/", auth, async (req, res) => {
  const {
    facebookPageId,
    googlePlaceId,
    trustpilotBusinessUnitId,
    yelpBusinessId,
  } = req.body;

  try {
    const business = await businessAccessLayer.getBusinessByUserId(req.user.id); // From auth middleware

    if (!business) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    const updatedBusiness = await businessAccessLayer.updateBusinessPlatformIds(
      business.business_id,
      {
        facebookPageId,
        googlePlaceId,
        trustpilotBusinessUnitId,
        yelpBusinessId,
      },
    );

    res.status(200).json(updatedBusiness);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
