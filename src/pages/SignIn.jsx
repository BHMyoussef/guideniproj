import React from 'react'
import { Link } from 'react-router-dom';
import Form from '../components/Form';
import Joi from 'joi';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import SignWith from '../components/SignWith';
import { langContext } from '../contexts/LangProvider';

export default class SignIn extends Form {
    state = {
        data: {
          email: "",
          password: "",
        },
        errors: {},
        signError:"",
        loading: false
    };
    schema = {
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: {} })
          .label("Email")
          .required(),
        password: Joi.string().min(5).max(24).label("Password").required(),
      };

      doSubmit = () => {
        const { data } = this.state
        this.setState({signError:"",loading:true})
        signInWithEmailAndPassword(auth,data.email,data.password)
        .then((currentUser)=>{
          console.log("succes")
        })
        .catch((error)=>{
          if(error.code === "auth/wrong-password")
            this.setState({signError:"email or password are invalide"})
          else
            if(error.code === "auth/user-not-found")
              this.setState({signError:`no user with this email, create one to continue`})
              this.setState({loading:false})
        })
        console.log("the loading state isis: ",this.state.loading)
      };
    
    render() {
        return (
          <langContext.Consumer>
            {
              value => 
                <div className="container mx-auto flex flex-col items-center mt-4">
                    { this.state.signError && <div className="bg-red-400 mt-2 py-2 px-4 text-white font-medium" >{ this.state.signError }</div> }
                    <h2 className='text-3xl font-semibold mb-8'>{value.signIn&&value.signIn.title} : </h2>
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput("email",value.signIn&& value.signIn.email, "Email")}
                        {this.renderInput("password",value.signIn&& value.signIn.password, "password")}
                        {this.renderButton( value.signIn&&value.signIn.logInBtn,this.state.loading)}
                    </form>
                    <Link className='mb-4 hover:border-b' to="/resetPassword">Forget Password?</Link>
                    <SignWith />
                    <Link 
                        className='hover:border-b-2 mt-4 hover:font-medium'
                        to="/signUp">{value.signIn?.alert}</Link>
                </div>
            }
          </langContext.Consumer>
        )
    }
}
