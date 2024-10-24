import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
   try {
      await connectDB();
       
      //Check if razorpayOrderId is present on the server
      let body = await req.formData();
      body = Object.fromEntries(body);

      let p = await Payment.findOne({ oid: body.razorpay_order_id });
      if (!p) {
         return NextResponse.json({ success: false, message: "Order ID not found" });
      }
      let user=await User.findOne({username:p.to_user})
      const secret=user.razorpaysecret
      //fetch the secret of the user who is getting the payment
      let xx = validatePaymentVerification(
         { "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id },
         body.razorpay_signature,
         secret
      );

      if (xx) {
         const updatePayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: "true" },
            { new: true }
         );

         // Debugging Logs
         console.log("Updated Payment:", updatePayment);
         console.log("Redirect URL:", `${process.env.NEXT_PUBLIC_URL}/${updatePayment?.to_user}?paymentdone=true`);

         // Check if to_user is valid
         if (!updatePayment || !updatePayment.to_user) {
            return NextResponse.json({ success: false, message: "User not found for redirection" });
         }

         // Redirect to the username page with the query parameter
         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatePayment.to_user}?paymentdone=true`);
      } else {
         return NextResponse.json({ success: false, message: "Payment Verification Failed" });
      }
   } catch (error) {
      console.error("Error in payment verification:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" });
   }
};
