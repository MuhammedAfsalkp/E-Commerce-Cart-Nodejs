exports.error=(req, res, next) => {
    console.log("ERROR page");

    console.log(req.url)
    res
      .status(404)
      .render("404", { pageTitle: "Page not found", path: "/error" });
  }