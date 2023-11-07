const express = require('express')
const userRouter = express.Router();
const { userpost, getUsers, getSingleUser, updateUser, deleteUser, updateStatus, userExport } = require('../controllers/userControllers')
const upload = require('../multerConfig/storageConfig')

userRouter.get('/userexport', userExport)
userRouter.post('/register', upload.single('user_profile'), userpost)
userRouter.get('/getUsers', getUsers)
userRouter.get('/:id', getSingleUser)
userRouter.put('/update/:id', upload.single('user_profile'), updateUser)
userRouter.delete('/delete/:id', deleteUser)
userRouter.put('/status/:id', updateStatus)


module.exports = userRouter