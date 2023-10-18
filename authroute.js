const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


router.post("/register", async(req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;


    if (name == null || email ==null || password == null || confirmpassword == null){
        return res.status(400).json({error : "Por favor, preencha todos os campos"});
        }
        if(password != confirmpassword){
        return res.status(400).json({error : "As senhas não conferem!!!"})
        }
        const emailExists = await User.findOne({email : email});
        if(emailExists){
        return res.status(400).json({error : "O e-mail informado já existe."})
        }
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({
        name : name,
        email : email,
        password: passwordHash
        });
        try {
        const newUser = await user.save();
        const token = jwt.sign(
        {
        name : newUser.name,
        id : newUser._id
        },
        "Segredo"
        );
        res.json({error: null, msg: "Você fez o cadastro com sucesso!!!", token: token, userId:
        newUser._id});
        } catch(error){
        res.status(400).json({error});
        }
        });
        
        module.exports = router;