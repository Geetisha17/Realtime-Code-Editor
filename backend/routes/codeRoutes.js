const express = require('express');
const router = express.Router();
const {executeCode, getCompileMessage} = require('../controllers/codeController');

router.get('/compile',getCompileMessage);
router.post('./compile',executeCode);