// import express from "express";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";

// const app=express();
// app.listen(5000,()=>{
//     console.log("server is working fine at host 5000");
// })

// mongoose.connect("mongodb+srv://nimitkaundalrock2004:uFOXiqSMzkqoZk3K@tespro.xauxxcn.mongodb.net/").then(()=>console.log("Database connected"));

// const userSchema = new mongoose.Schema({
//     name:String,
//     surname:String,
// });

// const User =mongoose.model("User",userSchema);

// app.use(cookieParser());
// app.use(express.urlencoded({extended:true}));

// app.set("view engine","ejs");

// app.get("/",(req,res)=>{
//     res.render("login");
// })
// app.get("/success",(req,res)=>{
//     res.send("sure");
// })

// app.post("/login",(req,res)=>{
    
//     const user=User.create({
//         name:req.body.name,surname:req.body.surname
//     });

//     res.cookie("token",user._id,{
//         httpOnly:true,
//         expires:new Date(Date.now()+60*1000),
//     });
//     console.log(req.cookies);
//     console.log(req.body);

//     res.redirect("/success");
// })
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import  Jwt from "jsonwebtoken";

const app = express();
app.listen(5000, () => {
  console.log("server is working fine at host 5000");
});

mongoose
  .connect("mongodb+srv://nimitkaundalrock2004:uFOXiqSMzkqoZk3K@tespro.xauxxcn.mongodb.net/")
  .then(() => console.log("Database connected"));

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
});

const User = mongoose.model("User", userSchema);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/success", (req, res) => {
  console.log(req.cookies); // Log cookies here
  res.send("sure");
});

const   isAuthenticated = async (req,res,next)=>{
    const {token} =req.cookies;
    if (token){
      const decoded=Jwt.verify(token,"hiphop");
      console.log(decoded);
      req.user=await User.findById(decoded._id);
      next();
    }else{
      res.render("login");
    }
}

app.get("/logout",(req,res)=>{

  res.clearCookie("token");
  res.render("login");
})

app.get("/me",isAuthenticated,(req,res)=>{
    console.log(req.cookies);
    console.log(req.user);
    res.render("logout",{name:req.user.name});
})



app.post("/login", async (req, res) => {


  try {
    const user = await User.create({
      name: req.body.name,
      surname: req.body.surname,
    });

    // let check = await User.findOne({ surname });
    // if (!check){
    //   return console.log("registerd first");
    // }
    

    const token=Jwt.sign({_id:user._id},"hiphop");
   

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });

    // console.log(req.cookies); // Log cookies here
    console.log(req.body);

    res.redirect("/me");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});






