import React from 'react'
import { Link } from 'react-router-dom'
import Joi from 'joi'
import { auth, firestore } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import Form from './Form'
import SignWith from './SignWith'
import { langContext } from '../contexts/LangProvider'

export default class UserForm extends Form {
    state = {
		data:{  
                email:'',
                password:''
            },
		errors:{},
		signError:"",
		loading: false
	}

    schema = {

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: {  } })
        .label('Email')
		.required(),

		password: Joi.string()
		.min(5).max(24)
		.label('Password')
		.required(),
	}

    doSubmit = ()=>{
		this.setState({signError:"",loading:true})
        const { data } = this.state
        console.log(data)
		createUserWithEmailAndPassword(auth,data.email,data.password)
		.then((userCredential=>{
			const docData = {
                email: data.email,
                rank: 'Bronze',
                rating: 0,
                totalRating: 0,
                userId: userCredential.user.uid
			}
			const newDoc = doc(firestore,`users/${userCredential.user.uid}`);
			setDoc(newDoc,docData)
		}))
		.catch(error=>{
			var errorMessage = "";
			if(error.code === "auth/email-already-in-use"){
				errorMessage = "this email is alreay used";
			}else{
				errorMessage = "something is wrong, please try again";
			}
			this.setState({signError:errorMessage,loading:false});
		})
	}

    render() {
        return (
            <langContext.Consumer>
                {
                    value =>
                <div className="flex flex-col items-center mt-4">
                    { this.state.signError && <div className='bg-red-400 mt-2 py-2 px-4 text-white font-medium'>{this.state.signError}</div>}
                    <form onSubmit={ this.handleSubmit } >
                        {	this.renderInput('email',value.signUp &&value.signUp.email,'Email')		}
                        {	this.renderInput('password',value.signUp &&value.signUp.password,'password')	}
                        {	this.renderButton(value.signUp &&value.signUp.signUpBtn,this.state.loading)	}
                    </form>
                    <SignWith/>
                    <Link 
                        to="/signUp"
                        className='hover:border-b-2 hover:scale-105'
                        >
                        Already have an account? Login
                    </Link>
                </div>
                }
            </langContext.Consumer>
        )
    }
}