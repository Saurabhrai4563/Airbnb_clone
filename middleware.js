module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //if user is not login so redirecting info after login is saved here
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}

