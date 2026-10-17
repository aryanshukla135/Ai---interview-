import {useContext} from 'react'
import {AuthContext} from '../auth.context.js'
import {login,logout,register} from '../services/auth.api.js'


export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    const handleLogin = async ({email,password}) =>{
        setLoading(true)
        try{
           const data = await login({email,password});
           setUser(data.user);
           return { success: true };
        }
        catch(error){
            console.error('Error logging in user:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to log in. Please try again.'
            };
        }finally{
        setLoading(false);
        }

    }

    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const data = await register({username,email,password});
            if (data.user) {
                setUser(data.user);
            }
            return { success: true };
        }   
        catch(error){
            console.error('Error registering user:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to register. Please try again.'
            };
        }
        finally{
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return { success: true };
        }   
        catch(error){
            console.error('Error logging out user:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to log out. Please try again.'
            };
        }
        finally{
            setLoading(false);
        }
    }

    return {user,loading,handleLogin,handleRegister,handleLogout}
}