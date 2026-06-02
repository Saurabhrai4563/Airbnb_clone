const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
    //res.send("working listing");
})
//new route
router.get("/new", isLoggedIn, (req, res) => {
    //console.log(req.user);
    res.render("listings/new");
})
//create route

router.post("/", isLoggedIn, validateListing,
    wrapAsync(async (req, res, next) => {

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings")

    }))
//show route
router.get("/:id", async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id).populate("reviews").populate("owner")
    if (!listing) {
        req.flash("error", "Listing Does not exist!");
        return res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing })
})

//form for update
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}))
//update after form redering
router.put("/:id", isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))




module.exports = router;