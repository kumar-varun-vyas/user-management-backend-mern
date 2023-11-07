const { error } = require('console')
const User = require('../models/userSchema')
const moment = require('moment')
const csv = require('fast-csv')
const fs = require('fs')
const BASE_URL = process.env.BASE_URL

exports.userpost = async (req, res) => {
    const profile = req.file.filename
    console.log(req.body)
    try {
        const { fname, lname, email, mobile, status, gender, location } = req.body
        if (!fname || !lname, !email || !mobile || !status || !gender || !location || !profile) {
            res.status(401).json("All Inputs are required")
        }

        const userExist = await User.findOne({ email: email })
        if (userExist) {
            res.status(401).json("User already exist")
        } else {
            const userData = new User({
                fname, lname, email, mobile, status, gender, location, profile
            });

            await userData.save()
            res.status(200).json(userData)

        }


    } catch (err) {
        res.status(401).json(err)
        console.log("catch block err ")
    }


}

//gett user data
exports.getUsers = async (req, res) => {
    try {
        const search = req.query.search || ''
        const gender = req.query.gender || ''
        const status = req.query.status || ''
        const sort = req.query.sort || ''
        const page = req.query.page || 1
        const ITEM_PER_PAGE = 4;
        const query = {
            'fname': { $regex: search, $options: 'i' }
        }
        if (gender != "All") {
            query.gender = gender
        }
        if (status != "All") {
            query.status = status
        }
        const skip = (page - 1) * ITEM_PER_PAGE

        const count = await User.countDocuments(query)
        console.log(count)

        const userdata = await User.find(query)
            .sort({ "createdAt": sort == 'New' ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pagecount = Math.ceil(count / ITEM_PER_PAGE)

        res.status(200).json({
            pagination: {
                count,
                pagecount
            },
            userdata
        })

    } catch (err) {
        res.status(400).json(err)
    }
}

// get single user

exports.getSingleUser = async (req, res) => {
    const { id } = req.params
    try {
        const userData = await User.findOne({ _id: id })
        console.log(id, userData)
        res.status(200).json(userData)
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params
    const profile = req.body
    console.log("profile---", id, req.headers, req.body, req.file)
    try {
        const { fname, lname, email, mobile, status, gender, location, user_profile } = req.body

        if (!fname || !lname, !email || !mobile || !status || !gender || !location) {
            res.status(401).json("All Inputs are required")
        }
        const file = req.file ? req.file.filename : user_profile
        if (!file) {
            res.status(401).json("Profile field required")
        }
        const userData = await User.findByIdAndUpdate({ _id: id },
            { fname, lname, email, mobile, status, gender, location, user_profile: file },
            {
                new: true
            }
        )
        await userData.save()

        res.status(200).json(userData)
    } catch (err) {
        res.status(400).json(err)
    }
}
// delete user

exports.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete({ _id: id })
        res.status(200).json("User deleted Successfully")
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body
    try {
        const userStatus = await User.findByIdAndUpdate({ _id: id }, { status: data }, { new: true })
        res.status(200).json(userStatus)
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.userExport = async (req, res) => {
    try {
        const userData = await User.find()

        const csvStream = csv.format({ headers: true })

        if (!fs.existsSync('public/files/export')) {
            if (!fs.existsSync('public/files')) {
                fs.mkdirSync('public/files')
            }

            if (!fs.existsSync('public/files/export')) {
                fs.mkdirSync('./public/files/export')
            }

        }

        const writablestream = fs.createWriteStream(
            'public/files/export/users.csv'
        )

        csvStream.pipe(writablestream)
        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`
            })
        })

        if (userData.length > 0) {
            userData.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : '-',
                    LasttName: user.lname ? user.lname : '-',
                    Email: user.email ? user.email : '-',
                    Mobile: user.mobile ? user.mobile : '-',
                    Gender: user.gender ? user.gender : '-',
                    Status: user.status ? user.status : '-',
                    Location: user.location ? user.location : '-',
                    Profile: user.profile ? user.profile : '-',
                    DateCreated: user.createdAt ? user.createdAt : '-',
                    DateUpdated: user.updatedAt ? user.updatedAt : '-',

                })
            })
        }
        csvStream.end()
        writablestream.end();

    } catch (err) {
        console.log("userexport err-----", err)

    }

}