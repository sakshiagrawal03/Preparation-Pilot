import axios from "axios";

const api=axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
     withCredentials:true
})

//these four functions are for communicating with backend 

export async  function register({username,email,password}){

   try{const response= await api.post('/api/auth/register',{
          username,email,password
     },
     {
          withCredentials:true   //we use this so that frontend  can access the cookie .
     })

     return response.data

   }catch(err){
     console.log(err);
     
   }
}

export async function login({email,password}){
     try{const response= await api.post('/api/auth/login',{
          email,password
     },{ withCredentials:true})
     
     return response.data

     }catch(err){
          console.log(err);
     }
}

export async function logout(){
     try {
          const response = await api.post('/api/auth/logout', null, {
               withCredentials: true
          });
          return response.data;
     } catch (err) {
          console.log(err);
     }
}


export async function getMe(){

     try {
          const response = await api.get('/api/auth/get-me', {
               withCredentials: true
          });
          return response.data;
     } catch (err) {
          return null;
     }
}
