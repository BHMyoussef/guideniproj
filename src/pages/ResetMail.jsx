import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {useState} from "react";
import {FaArrowRight} from "react-icons/fa"

const Reset = () => {
	const [error, setError] = useState('');
	// Email
	const [email, setEmail] = useState('');
	// toggle the divs
	const [sended, setSended] = useState(false);
	const handleReset = (e) => {
		e.preventDefault();			
		const auth = getAuth();
		sendPasswordResetEmail(auth, email.trim()) // remove additional space before sending it
		  .then(() => {
		    setSended(true);
		    setError('');
		  })
		  .catch((error) => {
		    const errorCode = error.code.split('/').at(-1);
		    setError(errorCode);
		    const errorMessage = error.message;
		    console.log({errorCode, errorMessage});
		  });

	}
	const change = (e) => {
		setEmail(e.target.value);
	}

	return (
	<div className="container mx-auto w-1/2">
		{error && 
		<div className="bg-red-400 mt-2 py-2 px-4 text-white font-medium w-full">
			<h3>{error.replaceAll('-',' ').toUpperCase()}</h3>
		</div>}
	{ sended ?(
		<section className="mt-10 flex items-center justify-center px-4 bg-white">
		        <div className="max-w-lg w-full rounded-lg shadow-lg p-4">
		            <h3 className="font-semibold text-lg tracking-wide">We sent a link to your account.</h3>
		            <div className="mt-2">
		                <a 
							href="http://mail.google.com/"
							target="_blank"
							className="text-gray-700  inline-flex items-center font-semibold"
						>
		                    <span className="hover:underline">
		                        Check your account
		                    </span>
		                    <span className="text-xl ml-2"><FaArrowRight /></span>
		                </a>
		            </div>
		        </div>
		    </section>

)
		:
		(
  		<form className="m-10 flex gap-2 flex-col justify-center" onSubmit={handleReset}>
    		<input 
			onChange={change}
			className="rounded-l-lg p-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
			style={{outline: 'none'}}
			type="email" required={true} placeholder="your@mail.com"/>
		<button 
			onClick={handleReset}
			style={{outline: 'none'}}
			className="px-8 rounded-r-lg bg-additional  text-white hover:shadow-lg font-bold p-3 uppercase border-t border-b border-r">
			Reset Password
		</button>
		</form>
	)}
	
	</div>

	)

}

export default Reset;
