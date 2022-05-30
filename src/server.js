import app from './app';
import mongoose from 'mongoose';

const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.PASSWORD);
const DATABASE_LOCAL = process.env.DATABASE_LOCAL;
mongoose
    .connect(DB, {
        // v6 not suppot affter config so we use v5.5.2
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        console.log('DB connection successful !');
    })
    .catch((err) => {
        console.log(err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Running on PORT 👉 http://localhost:${PORT} 🙉`);
});
