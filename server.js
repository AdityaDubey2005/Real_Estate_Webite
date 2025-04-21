const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Listing = require("./models/Listing");
const { data: sampleListings } = require("./init/data");

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up view engine
app.set("view engine", "ejs");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const listingRoutes = require("./routes/listings");
app.use("/listings", listingRoutes);

// Seed sample data if database is empty
mongoose.connection.once("open", async () => {
  const count = await Listing.countDocuments();
  if (count === 0) {
    // Insert sample listings if database is empty
    await Listing.insertMany(sampleListings);
    console.log("Sample data inserted");
  }
});

// Home route
app.get("/", async (req, res) => {
  const listings = await Listing.find();
  res.render("index", { listings });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
