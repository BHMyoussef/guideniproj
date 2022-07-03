import React from 'react'
import { Link } from 'react-router-dom'
import Form from './Form'
import Joi from 'joi'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firestore } from '../firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import SelectForm from './SelectForm'
import SignWith from './SignWith'
import { langContext } from '../contexts/LangProvider'

export default class EmployeeForm extends Form {
  state = {
		data:{
      firstName: '' ,
      lastName: '',
      phone:'+212 ',
      cityId:'',
      email:'',
      password:'',
      categoryId:'',
      subCategoryId:''
    },
    cities:[],
    categories:{
      eng:[],
      fr:[],
      ar:[]
    },
    subCategories:[],
		errors:{},
		signError:"",
		loading: false
	}

  schema = {
		phone:Joi.string()
    .length(14)
    .pattern(/^\+212 [0-9]+$/)
		.required(),

    firstName:Joi.string()
    .min(2)
    .max(12),

    lastName:Joi.string()
    .min(2)
    .max(12),

    cityId:Joi.string().required(),

    categoryId:Joi.string().required(),

    subCategoryId:Joi.string().required(),

    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: {  } })
    .label('Email')
		.required(),

		password: Joi.string()
		.min(5).max(24)
		.label('Password')
		.required(),
	}

  componentDidMount(){
    this.getCities();
    this.getCategories();
  }

  setCity=(cityId)=>{
    let data = this.state.data;
    data.cityId = cityId;
    this.setState({data: data.sort()});
  }
  setCategory=(categoryId)=>{
    let data = this.state.data;
    data.categoryId = categoryId;
    this.setState({data: data.sort()});
    this.getSubCategories();
  }
  setSubCategory=(subCategoryId)=>{
    let data = this.state.data;
    data.subCategoryId = subCategoryId
    this.setState({data: data.sort()});
  }

  getCities(){
    const citiesRef = collection(firestore,"cities");
    let cities = { ...this.state.cities };
    let citiesdb = []

    getDocs(citiesRef)
    .then(results=>{
      results.forEach(city=>{
        const obj = {
          id: city.data().cityId,
          name : city.data().cityName
        }
        citiesdb = [...citiesdb,obj]
      });
      cities = citiesdb.sort((a,b) => a.name - b.name);
      this.setState({cities})
    })
    .catch(error=>{
      console.log( "error eccured: " ,error );
    })
  }

  getCategories(){
    const CategoryRef = collection(firestore,"jobsCategories");
    let categories = { ...this.state.categories };
    let categoriesdb = {
      eng:[],
      fr:[],
      ar:[]
    }

    getDocs(CategoryRef)
    .then(results=>{
      results.forEach(category=>{
        const objEng = {
          id: category.data().categoryId,
          name : category.data().categoryName.eng
        }
        const objFr = {
          id: category.data().categoryId,
          name : category.data().categoryName.fr
        }
        const objAr = {
          id: category.data().categoryId,
          name : category.data().categoryName.ar
        }
        categoriesdb.eng = [...categoriesdb.eng,objEng]
        categoriesdb.fr = [...categoriesdb.fr,objFr]
        categoriesdb.ar = [...categoriesdb.ar,objAr]
      });
      categories = categoriesdb;
      this.setState({categories})
    })
    .catch(error=>{
      console.log( "error eccured: " ,error );
    })
  }
  getSubCategories(){
    const subCategoryRef = collection(firestore,"jobs");
    const q = query( subCategoryRef, where('categoryId','==',this.state.data.categoryId));
    let subCategories = { ...this.state.subCategories };
    let subCategoriesdb = {
      eng:[],
      fr:[],
      ar:[]
    }

    getDocs(q)
    .then(results=>{
      results.forEach(subCategory=>{
        const objEng = {
          id: subCategory.data().jobId,
          name : subCategory.data().jobName.eng
        }
        const objFr = {
          id: subCategory.data().jobId,
          name : subCategory.data().jobName.fr
        }
        const objAr = {
          id: subCategory.data().jobId,
          name : subCategory.data().jobName.ar
        }
        subCategoriesdb.eng = [...subCategoriesdb.eng,objEng]
        subCategoriesdb.fr = [...subCategoriesdb.fr,objFr]
        subCategoriesdb.ar = [...subCategoriesdb.ar,objAr]
      });
      subCategories = subCategoriesdb;
      this.setState({subCategories})
    })
    .catch(error=>{
      console.log( "error eccured: " ,error );
    })
  }

  doSubmit = ()=>{
		this.setState({signError:"",loading:true})
    const { data } = this.state
		createUserWithEmailAndPassword(auth,data.email,data.password)
    .catch(error=>{
			var errorMessage = "";
			if(error.code === "auth/email-already-in-use"){
				errorMessage = "this email is alreay used";
			}else{
				errorMessage = "something is wrong, please try again";
			}
			this.setState({signError:errorMessage,loading:false});
		})
		.then((userCredential=>{
			const docData = {
				firstName: data.firstName + " " + data.lastName ,
        email: data.email,
        phone: data.phone,
        userCity: data.cityId,
        jobId: data.categoryId,
        rank: 'Bronze',
        rating: 0,
        totalRatings: 0,
        userId: userCredential.user.uid
			}
			const newDoc = doc(firestore,`users/${userCredential.user.uid}`);
			setDoc(newDoc,docData)
		}))

	}


  render() {
    const { cities, categories, subCategories } = this.state
    return (
      <langContext.Consumer>
        {
          value =>
          <div className="flex flex-col items-center mt-4">
            { this.state.signError && <div className='bg-red-400 mt-2 py-2 px-4 text-white font-medium'>{this.state.signError}</div>}
            <form onSubmit={ this.handleSubmit } >
              { this.renderInput('firstName',value.signUp &&value.signUp.firstName) }
              { this.renderInput('lastName',value.signUp &&value.signUp.lastName) }
              {	this.renderInput('email',value.signUp &&value.signUp.email,'Email') }
              {	this.renderInput('password',value.signUp &&value.signUp.password,'password')	}
              { this.renderInput('phone',value.signUp &&value.signUp.phone) }
              <SelectForm title={value.signUp &&value.signUp.city} choices={ cities } setProperty={this.setCity}/>
              <SelectForm title="enter your category" choices={ categories[value.currentLang] } setProperty={this.setCategory}/>
              <SelectForm title="enter your SubCategory" choices={ subCategories[value.currentLang] } setProperty={this.setSubCategory}/>
              {	this.renderButton(value.signUp &&value.signUp.signUpBtn,this.state.loading)	}
            </form>
            <SignWith />
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
