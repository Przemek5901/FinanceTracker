const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/finance-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB error:"));
db.once("open", () => console.log("Połączono z MongoDB"));

webpush.setVapidDetails(
  "mailto:twoj_email@example.com",
  "BMlXIzNWhKNSTT8aSrMxX-z8_EIa9KqP9rK2dSs-P33qU69gGKjpaoX_bLUXkIlzxLrtN7OlHu6XBbrEhibNeuk",
  "Qe-DfJBmSuW0aJoQ0vTgWgE05yDVZzK9UBEzvAOdvxY"
);

const subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    auth: String,
    p256dh: String,
  },
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);

const transactionSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  type: String,
  note: String,
  date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model("Transaction", transactionSchema);

app.post("/api/addTransaction", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    const subscriptions = await Subscription.find();
    const payload = JSON.stringify({
      title: "Nowa transakcja",
      body: "Dodano nową transakcję.",
      icon: "/assets/icons/icon-96x96.png",
      vibrate: [100, 50, 100],
    });

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err) {
        if (err.statusCode === 410) {
          await Subscription.deleteOne({ _id: sub._id });
        }
      }
    }

    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/api/recentTransactions", async (req, res) => {
  try {
    const recent = await Transaction.find().sort({ date: -1 }).limit(10);
    res.set("Cache-Control", "public, max-age=3600");
    res.json(recent);
  } catch (err) {
    console.error("Błąd przy pobieraniu ostatnich transakcji:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/api/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    res.set("Cache-Control", "public, max-age=3600");
    res.json({ balance, income, expense });
  } catch (err) {
    console.error("Błąd przy liczeniu salda:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/api/monthlyReports", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const monthlyData = Array.from({ length: 12 }, () => ({
      income: 0,
      expense: 0,
    }));

    for (const t of transactions) {
      const month = new Date(t.date).getMonth();
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else if (t.type === "expense") {
        monthlyData[month].expense += t.amount;
      }
    }

    res.set("Cache-Control", "public, max-age=3600");
    res.json(monthlyData);
  } catch (err) {
    console.error("Błąd raportu miesięcznego:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.post("/api/subscribe", async (req, res) => {
  try {
    const { endpoint } = req.body;

    await Subscription.deleteMany({ endpoint });

    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json({ message: "Zapisano subskrypcję" });
  } catch (error) {
    console.error("Błąd zapisu subskrypcji:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
