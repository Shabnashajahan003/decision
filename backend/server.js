const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* MongoDB Connection */
mongoose.connect("mongodb://127.0.0.1:27017/loginDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* User Schema */
const User = mongoose.model("users", {
    name: String,
    email: String,
    password: String
});


const Decision = mongoose.model("decisions", {
    userEmail: String,
    decisionName: String,
    criteria: Array,
    options: Array,
    results: Array,
    bestOption: String,
    createdAt: { type: Date, default: Date.now }
});


app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send("Signup successful");
    } catch (err) {
        res.send("Signup failed");
    }
});


app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (user) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.json({ success: false, message: "Invalid login" });
        }
    } catch (err) {
        res.json({ success: false });
    }
});

app.post("/logout", (req, res) => {
    res.send("Logged out");
});


app.post("/saveDecision", async (req, res) => {
    try {
        const { options, results } = req.body;

        // Find best option
        let max = Math.max(...results);
        let index = results.indexOf(max);
        let bestOption = options[index];

        const decision = new Decision({
            ...req.body,
            bestOption
        });

        await decision.save();
        res.send("Decision saved");
    } catch (err) {
        res.send("Error saving decision");
    }
});

/* Get Decisions for Logged-in User */
app.get("/decisions/:email", async (req, res) => {
    try {
        const data = await Decision.find({
            userEmail: req.params.email
        }).sort({ createdAt: -1 });

        res.json(data);
    } catch (err) {
        res.send("Error fetching decisions");
    }
});

/* Delete Decision */
app.delete("/deleteDecision/:id", async (req, res) => {
    try {
        await Decision.findByIdAndDelete(req.params.id);
        res.send("Decision deleted successfully");
    } catch (err) {
        res.send("Error deleting decision");
    }
});

/* Serve Frontend */
app.use(express.static(path.join(__dirname, "../frontend")));

/* Start Server */
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});