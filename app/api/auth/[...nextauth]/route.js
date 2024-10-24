// import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
// import mongoose from 'mongoose';
// import User from '@/models/User';
// import Payment from '@/models/Payment';
// import connectDB from '@/db/connectDb';

// export const authoptions=NextAuth({
//   providers:[
//     GitHubProvider({
//       clientId:process.env.GITHUB_ID,
//       clientSecret:process.env.GITHUB_SECRET
//     }),

//   ],
//   callbacks:{
//     async signIn({user,account,profile,email,credentials}){
//       if(account.provider==='github'){
//         const currentUser=await User.findOne({email:user.email})
//         if(!currentUser){
//           const newUser=new User({
//             email:user.email,
//             username:user.email.split("@")[0],
//           })
//           await newUser.save()
//           console.log(newUser)
//           user.name=newUser.username;
//         }
//         else{
//           user.name=currentUser.username;
//         }
//         return true;
//       }
//       return false;
//     },
//     async session({session,user,token}){
//       const dbUser=await User.findOne({email:session.user.email})
//       session.user.name=dbUser.username
//       return session
//     },
//   }
// })
// export {authoptions as GET,authoptions as POST}



import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/db/connectDb';

export const authOptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectDB();  // Ensure DB connection

      if (account.provider === 'github') {
        const currentUser = await User.findOne({ email: user.email });

        if (!currentUser) {
          const newUser = new User({
            email: user.email,
            username: user.email.split("@")[0],
          });
          await newUser.save();
          console.log(newUser);
          user.name = newUser.username;
        } else {
          user.name = currentUser.username;
        }

        return true;
      }
      return false;
    },
    async session({ session, user, token }) {
      await connectDB();  // Ensure DB connection

      const dbUser = await User.findOne({ email: session.user.email });
      console.log(dbUser)
      if (dbUser) {
        session.user.name = dbUser.username;
      }
      
      return session;
    },
  }
});

export { authOptions as GET, authOptions as POST };
