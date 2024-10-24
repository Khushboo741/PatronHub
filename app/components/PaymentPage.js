"use client"
import React, { useState,useEffect } from 'react' 
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import {fetchuser,fetchpayments,initiate} from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import { useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';
import { notFound } from "next/navigation"
const PaymentPage = ({username}) => {
   //  const {data:session}=useSession()
   
        const [paymentform, setPaymentform] = useState({name:"",message:"",amount:""});
        const [currentUser, setcurrentuser] = useState({});
        const [payments, setPayments] = useState([]);
       const searchParams=useSearchParams();
       const router=useRouter();

        useEffect(() => {
          getData();
        }, []);
      
        useEffect(() => {
            if(searchParams.get("paymentdone")=="true"){
            toast('🦄 Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                });
            }
            router.push(`/${username}`)
        }, []);
        
        const handleChange = (e) => {
          setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
        };
      
        const getData = async () => {
          let u = await fetchuser(username);
          setcurrentuser(u);
          let dbpayments = await fetchpayments(username);
          setPayments(dbpayments);
        };
      
        const pay = async (amount) => {
         try{
          let a = await initiate(amount, username, paymentform);
          let orderId = a.id;
          var options = {
            // key: process.env.NEXT_PUBLIC_KEY_ID,
            "key":currentUser.razorpayid,
            amount: amount,
            currency: "INR",
            name: "Get Me A Chai",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: orderId,
            callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            profile: {
              name: "Avni Jain",
              email: "gaurav.kumar@example.com",
              contact: "9000090000",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
        // var rzp1 = new Razorpay(options);
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        }
        catch(error){
          console.log("Error during payment initiation:",error);
        }
        };
      
        return (
          <>
          <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
{/* Same as */}
{/* <ToastContainer /> */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      
            <div className="cover w-full bg-red-50 relative">
              <img
                className="object-cover w-full h-[350]"
                src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3Ijo5NjAsIndlIjoxfQ%3D%3D/16.gif?token-time=1728000000&token-hash=IiupXQhE_oXqOhF7tLgO-c_JBGFF9lc6VUxJJ7370UI%3D"
                alt=""
              />
              <div className="absolute -bottom-20 right-[46%] border-black border-2 rounded-full  overflow-hidden size-28 flex items-center justify-center">
                <img
                  className="rounded-full object-cover w-full h-full size-28"
                //   width={128}
                //   height={128}
                  //Set kar sakte ho
                  
                //   src="Catt.jpg"
                src={currentUser.profilepic}
                  alt=" "
                />
              </div>
            </div>
            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2 ">
              <div className="font-bold text-lg">@{username}</div>
              <div className="text-slate-400">Lets help {username} get a chai!</div>
              <div className="text-slate-400">
               {payments.length} Payments .  ₹{payments.reduce((a,b)=>a+b.amount,0)} raised
              </div>
              <div className="payment flex gap-2 w-[80%] mt-11">
                <div className="supporters w-1/2 bg-slate-900 rounded-lg text-white p-10">
                  {/* Show list of all the supporters as a leaderboard */}
                  <h2 className="text-2xl font-bold my-5">Supporters</h2>
                  <ul className="mx-5 text-lg">
                    {payments.length==0 && <li>No payments yet</li>}
                    {payments.map((p, i) => (
                      <li key={i} className="my-4 flex gap-2 items-center">
                        <img width={34} src="user.gif" alt="" />
                        <span>
                          {p.name} donated{" "}
                          <span className="font-bold">₹{p.amount}</span> with a
                          message "{p.message} "
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
      
                <div className="makePayment w-1/2 bg-slate-900 rounded-lg text-white p-10">
                  <h2 className="text-2xl font-bold my-5">Make a payment</h2>
                  <div className="flex gap-2 flex-col">
                    {/* Input for name and message */}
                    <div>
                      <input
                        onChange={handleChange}
                        value={paymentform.name}
                        name="name"
                        type="text"
                        className="w-full p-2 rounded-lg bg-slate-800"
                        placeholder="Enter Name"
                      />
                    </div>
                    <input
                      onChange={handleChange}
                      value={paymentform.message}
                      name="message"
                      type="text"
                      className="w-full p-2 rounded-lg bg-slate-800"
                      placeholder="Enter Message"
                    />
                    <input
                      onChange={handleChange}
                      value={paymentform.amount}
                      name="amount"
                      type="text"
                      className="w-full p-2 rounded-lg bg-slate-800"
                      placeholder="Enter Amount"
                    />
      
                    <button onClick={()=>pay(Number.parseInt(paymentform.amount)*100)}
                      type="button"
                      className="w-fit text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-blue-900" disabled={paymentform.name?.length<2 ||paymentform.message?.length<4 ||paymentform.amount?.length<1}
                       >
                      Pay Now
                    </button>
                  </div>
                  {/* Or choose from these amounts */}
                  <div className="flex gap-2 mt-5">
                    <button
                      className="bg-slate-800 p-2 rounded-lg"
                      onClick={() => pay(1000)}
                    >
                      Pay ₹10
                    </button>
                    <button
                      className="bg-slate-800 p-2 rounded-lg"
                      onClick={() => pay(2000)}
                    >
                      Pay ₹20
                    </button>
                    <button
                      className="bg-slate-800 p-2 rounded-lg"
                      onClick={() => pay(3000)}
                    >
                      Pay ₹30
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      };
      
      export default PaymentPage;
      //npm install --save react-toastify
      //Ctrl+f sari occurences change karne ke liye
      //npm i razorpay