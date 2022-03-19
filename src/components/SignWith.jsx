import { useAuth } from "../contexts/AuthProvider"
import { FaFacebook, FaGoogle } from 'react-icons/fa'


export default function SignWith(){
    const { SignInWith } = useAuth()
    return (
        <div className="flex gap-x-8">
            <FaGoogle 
                className='hover:text-blue-600 cursor-pointer'
                size='1.25rem'
                onClick={() => SignInWith("Google")} 
            />
            <FaFacebook     
                className='hover:text-blue-700 cursor-pointer'
                size='1.25rem'
                onClick={() => SignInWith("Facebook")} 
            />
        </div>
    )
}