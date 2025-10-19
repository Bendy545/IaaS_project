// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB připojeno"))
    .catch(err => console.error("Chyba při připojení k MongoDB:", err));

// Definice schématu
const postSchema = new mongoose.Schema({
    Title: String,
    Content: String,
    Date: Date
});

const Post = mongoose.model('Post', postSchema, 'idnes');

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ Date: -1 }).limit(15);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
