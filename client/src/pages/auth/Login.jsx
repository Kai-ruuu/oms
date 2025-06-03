import { Link } from 'react-router-dom';
import image from "../../assets/kzc.jpg"
import { getBreakpoint, useViewport } from '../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../helpers/routing';
import { startSession } from '../../helpers/auth';

export default function Login() {
  const { width, height } = useViewport()
  const [breakpoint, setGetBreakpoint] = useState(null)

  const [email, setEmail] = useState(null)
  const [pass, setPass] = useState(null)
  const [remember, setRemember] = useState(false)
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])

  const login = async () => {
    try {
      const reqBody = new FormData()
      reqBody.append("email", email)
      reqBody.append("password", pass)
      
      const response = await fetch(`http://${location.hostname}:3000/user/login`, {
        method: "POST",
        body: reqBody
      })
      const data = await response.json()

      if (response.status != 200) {
        alert(data.message || data.error)
        return
      }
      
      delete data.message

      startSession(data, remember)

      if (data.role == "buyer")
        navigator(routes.users.buyer.home)
      else
        navigator(routes.users.seller.home)
    } catch (error) {
        alert("An error occured. Please try again.")
    }
  }
  
  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gray-100 text-md md:text-lg text-gray-600">
      <div className="flex flex-col md:flex-row items-stretch shadow-2xl min-w-8/10 max-w-8/10 min-h-2/3 rounded-tl-3xl rounded-br-3xl overflow-clip md:min-h-9/10 md:min-w-7/10">
        <form
        onSubmit={async e => {
          e.preventDefault()
          await login()
        }}
        className='bg-white px-10 md:px-14 py-8  flex flex-col flex-grow md:flex-grow-0 md:w-2/5 items-stretch justify-center'
        >
          <h1 className='text-3xl mb-6 font-bold'>KZC Login</h1>
        
          {/* email */}
          <section className='flex flex-col space-y-2 my-1'>
            <label htmlFor="email">Email</label>
            <input
            type="email"
            id='email'
            required
            placeholder='example@email.com'
            onChange={e => { setEmail(e.target.value) }}
            className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
            />
          </section>

          {/* password */}
          <section className='flex flex-col space-y-2 my-1'>
            <label htmlFor="password">Password</label>
            <input
            type="password"
            id='password'
            required
            placeholder='********'
            onChange={e => { setPass(e.target.value) }}
            className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
            />
          </section>

          {/* remember */}
          <label htmlFor="remember" className='text-sm flex items-center my-1 space-x-2 cursor-pointer'>
            <input
            type="checkbox"
            id='remember'
            onChange={() => { setRemember(v => !v) }}
            className='w-4 h-4 accent-gray-900'
            />
            <span>Remember my account</span>
          </label>

          <button className='cursor-pointer bg-gray-900 text-gray-300 py-2 rounded-sm my-4'>Login</button>

          <p className='text-sm'>No account yet? <Link to={routes.auth.register} className='hover:underline font-bold'>Register</Link> now</p>
        </form>
        {breakpoint != "xs" && <div style={{ backgroundImage: `url(${image})` }} className="bg-cover bg-no-repeat bg-center   flex-grow"></div>}
      </div>
    </div>
  );
}

