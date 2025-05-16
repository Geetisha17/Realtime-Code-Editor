const express = require('express');
const router = express.Router();
const { 
    executeCode, 
    getCompileMessage, 
    saveCode,
    getAllCode,
    deleteCode,
    updateCode 
    } = require('../controllers/codeController');

const verifyToken = require("../middleware/firebaseAuth");

router.get('/compile',getCompileMessage);
router.post('/compile',executeCode);

router.post('/save',verifyToken,saveCode);
router.get('/all',verifyToken,getAllCode);
router.delete('/delete/:id',verifyToken,deleteCode);
router.put('/update/:id',verifyToken,updateCode);

module.exports = router;