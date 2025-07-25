
import { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { Link } from 'react-router-dom'
import { vaildateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'


const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();   

    if(!vaildateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    } 

    if(!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else  {
          navigate("/user/dashboard");
        }
      }
      }  catch (error) {
         if(error.response && error.response.data.message) {
          setError(error.response.data.message);
         } else {
          setError("Something went wrong. Please try again later.");
         }
    }
  };


  return <AuthLayout>
    <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'> Welcome Back  </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please login to your account</p>
    
      <form onSubmit={handleLogin}>
        <Input 
        value={email}
        onChange={({target}) => setEmail(target.value)}
        label ="Email Address"
        placeholder="Enter your email"
        type="text"
        />

        <Input 
        value={password}
        onChange={({target}) => setPassword(target.value)}
        label ="Password"
        placeholder="Enter your password (min 8 characters)"
        type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        
        <button 
          type='submit' 
          className='btn-primary'
        >
          Login
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>Don't have an account? {" "} 
          <Link className='text-primary font-medium underline' to="/signUp">
          Sign Up
          </Link>
        </p>


      </form>
    </div>

  </AuthLayout>
}

export default Login