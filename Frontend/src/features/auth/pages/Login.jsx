import React from 'react'
import { useNavigate , Link} from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth.js'
import { useState } from 'react'


const Login = () => {

   const {loading,handleLogin} = useAuth()
   const navigate = useNavigate();


   const [email,setEmail] = useState("")
   const [password,setPassword] = useState("")
   const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const result = await handleLogin({email,password})
        if (result.success) {
            navigate("/home")
        } else {
            setErrorMessage(result.message)
        }
    }

    if(loading){
        return (<main> <h1>Loading........</h1> </main>)
    }


  return (
    <main>
        <div className = 'form-container'>
            <h1>Login</h1>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <form onSubmit ={(e)=>{
                handleSubmit(e);
            }}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>  
                    <input 
                      onChange = {(e) =>{
                         setEmail(e.target.value)
                      }}
                    type="email" name="email" id="email" placeholder='Enter your email' /> 
                </div>
               <div className="input-group">
                    <label htmlFor="password">Password</label>  
                    <input 
                        onChange = {(e) =>{
                         setPassword(e.target.value)
                      }}
                    type="password" name="password" id="password" placeholder='Enter your password' />
               </div>
              
              <button  className='button primary-button'>Login</button>   
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login
