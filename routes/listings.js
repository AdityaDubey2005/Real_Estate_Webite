const express = require("express");
const Listing = require("../models/Listing");
const router = express.Router();

// Display all listings (GET request)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch all listings from MongoDB
    res.render("index", { listings }); // Render the 'index' template with listings
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a new listing form (GET request)
router.get("/add", (req, res) => {
  res.render("add"); // Render the 'add' template (form to add a listing)
});

// Create a new listing (POST request)
router.post("/add", async (req, res) => {
  const { title, description, price, location, country, image } = req.body;

  try {
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: { filename: image, url: image }, // Handle image URL
    });

    await newListing.save(); // Save the new listing to MongoDB
    res.redirect("/listings"); // Redirect to the listings page after adding
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit a listing form (GET request)
router.get("/edit/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id); // Fetch listing by ID
    if (!listing) {
      return res.status(404).send("Listing not found."); // If listing not found, return error
    }
    res.render("edit", { listing }); // Render the edit form with the listing data
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update a listing (POST request)
router.post("/edit/:id", async (req, res) => {
  const { title, description, price, location, country, image } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, // The listing ID to update
      {
        title,
        description,
        price,
        location,
        country,
        image: { filename: image, url: image }, // Handle image URL
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedListing) {
      return res.status(404).send("Listing not found.");
    }

    res.redirect("/listings"); // Redirect to the listings page after update
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a listing (POST request)
router.post("/delete/:id", async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id); // Delete the listing by ID
    if (!deletedListing) {
      return res.status(404).send("Listing not found.");
    }
    res.redirect("/listings"); // Redirect to the listings page after deletion
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
