const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
    console.log("DB connected Sucessfully");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "6a1b3ec0cb8f7d85ece55944"
    }));
    await Listing.insertMany(initData.data).then((res) => {
        console.log("Data saved")
    }).catch((err) => {
        console.log(err);
    })

    //console.log("Data was initialiszed")
}

initDB();