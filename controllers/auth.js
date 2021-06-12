const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodeMailer.createTransport(
    sendGridTransport({
        auth: {
            api_key:
                "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",
        },
    })
);

exports.getLogin = (req, res, next) => {
    let oldInput = req.session.oldInput
        ? req.session.oldInput
        : { email: "", password: "" };
    req.session.oldInput = null;
    let message = req.flash("error");
    let invalid;

    if (message.length > 0) {
        message = message[0];
        if (message.includes("Email")) {
            console.log("Email");
            invalid = "Email";
        }
        if (message.includes("Password")) {
            console.log("Password");
            invalid = "Password";
        }
    } else {
        message = null;
        invalid = null;
    }

    console.log("MID GET LOGIN");
    console.log(req.session);
    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput,
        invalid,
    });
};

exports.postLogin = async (req, res, next) => {
    try {
        console.log("MID POST LOGIN", req.body);
        const email = req.body.email;
        const password = req.body.password;
        const oldInput = { email, password };
        let arr = validationResult(req).array();
        console.log(arr);
        if (arr.length > 0) {
            req.flash("error", `${arr[0].msg}`);
            req.session.oldInput = oldInput;
            return req.session.save((err) => {
                console.log(err);

                res.redirect("/login");
            });
        }
        const user = await User.findOne({ email: email });
        console.log(user);
        req.session.oldInput = null;
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
            console.log(req.session);
            res.redirect("/");
        });
    } catch (err) {
        console.log(err, "login");
        // req.flash('error',`${err}`)
        // req.session.save(e=>{
        //     console.log(e)
        //   if(e){ next(new Error(err))}
        //   res.redirect("/500")

        // })
        return next(new Error(err));
    }
};

exports.postLogout = (req, res, next) => {
    console.log("MID POST LOGOUT");
    req.session.destroy(() => {
        console.log("session deleted");
        res.redirect("/");
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    let invalid = null;
    let oldInput = req.session.oldInput
        ? req.session.oldInput
        : { email: "", password: "", confirmPassword: "" };
    req.session.oldInput = null;
    console.log(oldInput);
    if (message.length > 0) {
        message = message[0];
        if (message.includes("Email")) {
            console.log("Email");
            invalid = "Email";
        }
        if (message.includes("Password")) {
            console.log("Password");
            invalid = "Password";
        }
        if (message.includes("Confirm")) {
            console.log("Confirm");
            invalid = "Confirm";
        }
    } else {
        message = null;
        invalid = null;
    }
    console.log(invalid, message);
    res.render("auth/signup", {
        path: "/signup",
        errorMessage: message,
        pageTitle: "signup",
        isAuthenticated: false,
        oldInput,
        invalid,
    });
};

exports.postSignup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const oldInput = { email, password, confirmPassword };

        console.log("post signup mid", req.body);
        let arr = validationResult(req).array();
        console.log(arr);
        if (arr.length > 0) {
            req.flash("error", `${arr[0].msg}`);
            req.session.oldInput = oldInput;
            return req.session.save((err) => {
                res.redirect("/signup");
            });
        }

        const hashPaasword = await bcrypt.hash(password, 12);
        const us = new User({
            email: email,
            password: hashPaasword,
            cart: { items: [] },
        });
        us.save()
            .then((ris) => {
                console.log("added user");
                res.redirect("/login");
                return transporter
                    .sendMail({
                        to: email,
                        from: "af-shopingcart@afsolutions.xyz",
                        subject: "Signed up Succeessfully",
                        html: `<h1>Welcome to Af-shopingcart.</h1>
                    <p>Login to experience oue service...</p>
                    <p>Enjoy....</p>`,
                    })
                    .then((ris) => console.log("Email has been sent."))
                    .catch((err) => console.log(err, "sending email"));
            })
            .catch((err) => console.log(err, "signing user"));
    } catch (err) {
        console.log(err, "post signup");
        return next(new Error(err));
    }
};

exports.getResetPassword = (req, res, next) => {
    let oldInput = req.session.oldInput ? req.session.oldInput : { email: "" };
    req.session.oldInput = null;
    console.log(oldInput);
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/resetP", {
        pageTitle: "Reset password",
        path: "/reset",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput,
    });
};

exports.postResetPassword = async (req, res, next) => {
    try{
    const email = req.body.email;
    const oldInput = { email };

    let arr = validationResult(req).array();
    console.log(arr);
    if (arr.length > 0) {
        req.flash("error", `${arr[0].msg}`);
        req.session.oldInput = oldInput;
        return req.session.save((err) => {
            res.redirect("/reset");
        });
    }
    
        let tokenBuffer = await crypto.randomBytes(32);
        const token = tokenBuffer.toString("hex");

        let user = await User.findOne({ email: email });

        console.log("email exist..update", user);
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 3600000;
        await user.save();
        console.log("saved user successfullly", user);
        //res.redirect("/")
        await transporter.sendMail({
            to: email,
            from: "af-shopingcart@afsolutions.xyz",
            subject: "Password Reset",
            html: `
                <p>You requested for a password request.</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}"> link </a>to reset password.</p>
            
            `,
        });
        console.log("Email sent");
        req.flash("error", `The reset link has been send to ${email} `);
        return req.session.save((err) => {
            res.redirect("/reset");
        });
    } catch (err) {
        console.log("Email cant send");
        console.log(err, "post reset password");
        req.flash("error", `The  ${email} is not valid or Error in Email server`);
        req.session.oldInput = oldInput;
        return req.session.save((err) => {
            res.redirect("/reset");
        });
    }
};

exports.getNewPassword = async (req, res, next) => {
    try {
        console.log("Get new password");
        let message;
        const token = req.params.token;
        console.log(token);
        User.findOne(
            { resetToken: token, tokenExpiration: { $gt: Date.now() } },
            async (err, user) => {
                if (!user) {
                    console.log("No user with such restToken...check");
                    req.flash("error", "Token expired!!or Token malformed");
                    return req.session.save((err) => {
                        console.log("flash saved");
                        res.redirect("/err");
                    });
                }
                console.log(user);
                message = req.flash("error");
                if (message.length > 0) {
                    message = message[0];
                } else {
                    message = null;
                }
                res.render("auth/newPassword", {
                    pageTitle: "New password",
                    path: "/newPassword",
                    userId: user._id,
                    isAuthenticated: req.session.isLoggedIn,
                    errorMessage: message,
                    token: token,
                });
            }
        );
    } catch (err) {
        console.log(err, "getNew password");
        return next(new Error(err));
    }
};
exports.postNewPassword = async (req, res, next) => {
    try{
    console.log("Post new password", req.body);
    const token = req.body.token;
    let arr = validationResult(req).array();
    console.log(arr);
    if (arr.length > 0) {
        req.flash("error", `${arr[0].msg}`);
        return req.session.save((err) => {
            res.redirect(`reset/${token}`);
        });
    }

    const password = req.body.password;
    const hashpassword = await bcrypt.hash(password, 12);
    const userId = req.body.userId;
    User.findById(userId, async (err, user) => {
        console.log(user);
        if (!user || err) {
            console.log(err);
            req.flash("error", `user not found  error:-${err}`);
            return req.session.save((err) => {
                res.redirect(`reset/${token}`);
            });
        }
        user.password = hashpassword;
        await user.save();
        res.redirect("/login");
    });
}catch(err){
    console.log(err, "post new password");
    return next(new Error(err));
}
};
