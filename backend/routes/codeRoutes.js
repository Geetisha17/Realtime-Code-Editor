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


router.get('/compile',getCompileMessage);
router.post('/compile',executeCode);

router.post('/save',saveCode);
router.get('/all/:userId',getAllCode);
router.delete('/delete/:userId/:id',deleteCode);
router.put('/update/:userId/:id',updateCode);

module.exports = router;