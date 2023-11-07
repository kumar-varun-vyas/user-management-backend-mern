const mongoose = require('mongoose')
const DB = process.env.DB_URL

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log('Database connected')).catch((err) => console.log(err))
