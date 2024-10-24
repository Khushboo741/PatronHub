"use server"
// Install npm i razorpay
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
    await connectDB()
    
    let user=await User.findOne({username:to_username});
    if (!user) throw new Error(`User with username ${to_username} not found`);
    
    const secret=user.razorpaysecret
    var instance = new Razorpay({
        key_id: user.razorpayid, // Correct spelling here
        key_secret: secret // Correct spelling here
    });

    let options = {
        amount: Number.parseInt(amount), // Corrected typo in `Number`
        currency: "INR",
    };

    let x 
    try{
        x=await instance.orders.create(options);
    }
    catch(error){
        throw new Error("Failed to create Razorpay order: " + error.message);
    }

    // Create a payment object showing a pending status in the database
    await Payment.create({
        oid: x.id,
        amount: amount/100,
        to_user: to_username,
        name: paymentform.name,
        message: paymentform.message
    });
    
    return x;
};

// Corrected fetchuser function
export const fetchuser = async (username) => {
    await connectDB()
    // Use the User model instead of username string
    let u = await User.findOne({ username: username })
     if (!u) throw new Error(`User with username ${username} not found`)
    
    let user = u.toObject({ flattenObjectIds: true })
    return user
};

// Corrected fetchpayments function
export const fetchpayments = async (username) => {
    await connectDB()
    // Fetch payments sorted by amount in descending order
    let p = await Payment.find({ to_user: username,done:true}).sort({ amount: -1 }).lean()
    return p
};

export const updateProfile=async(data,oldusername)=>{
    await connectDB()
    let ndata=Object.fromEntries(data)
    if(oldusername!==ndata.username){
        let u=await User.findOne({username:ndata.username})
        if(u){
            return {error:"Username already exists"}
        }
        await User.updateOne({email:ndata.email},ndata)
        //Now update all the username in the Payments table
        await Payment.updateMany({to_user:oldusername},{to_user:ndata.username})
    }
    else{
           await User.updateOne({email:ndata.email},ndata)
    }
    
}
// "use server"; // Correct directive

// // Install Razorpay: npm install razorpay
// import Razorpay from "razorpay";
// import Payment from "@/models/Payment";
// import connectDB from "@/db/connectDb";
// import User from "@/models/User";

// export const initiate = async (amount, to_username, paymentform) => {
//     await connectDB(); // Ensure database connection

//     var instance = new Razorpay({
//         key_id: process.env.KEY_ID,
//         key_secret: process.env.KEY_SECRET
//     });

//     let options = {
//         amount: Number.parseInt(amount),
//         currency: "INR",
//     };

//     let x = await instance.orders.create(options);

//     // Create a payment object showing pending status in the database
//     await Payment.create({
//         orderId: x.id,
//         amount: amount,
//         to_username: to_username,
//         name: paymentform.name,
//         message: paymentform.message
//     });

//     return x;
// };

