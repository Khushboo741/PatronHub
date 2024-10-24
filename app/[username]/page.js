import React from 'react'
import PaymentPage from '../components/PaymentPage'
import { notFound } from "next/navigation"
import connectDB from '@/db/connectDb'
import User from '@/models/User'
const Username = async ({params} ) => {
  //http://localhost:3000/keepshine4884/bhvefw mtlb kuch bhi ese likhne pe 404 not found aayega page
  //If the username is not present in the database, show a 404 page
  const checkUser=async()=>{
  await connectDB()
 let u=await User.findOne({username:params.username})
 if(!u){
  return notFound()
 }
}
await checkUser()
  return (
    <>
    <PaymentPage username={params.username}/>
    {/* {params.username} */}
    
      </>
  )
}

export default Username

// http://localhost:3000/Khushboo