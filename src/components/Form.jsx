import React,{ Component} from 'react';
import Joi from 'joi';
import Input from './Input';

class Form extends Component{
	state = {
		data:{ },
	}

	validateProperty= input => {
		const obj = { [input.name]: input.value};
		const schema = { [input.name] : this.schema[input.name]}
		const result = Joi.object(schema).validate(obj);
		if(!result.error)
			return null;
		return result.error.details[0].message;
	}

	handleChange = ({currentTarget: input}) => {
		const errors = {...this.state.errors};
		const errorMsg = this.validateProperty(input);
		if(errorMsg)
			errors[input.name]=errorMsg;
		else
			delete errors[input.name];
		const data = { ...this.state.data};
		data[input.name]=input.value;
		this.setState({ data, errors });
	}

	validate = ()=>{
		const option = { abortEarly: false };
		const result = Joi.object(this.schema).validate(this.state.data,option);
		if(!result.error) return null;
		const errors = {};
		for(let item of result.error.details)
			errors[item.path[0]]=item.message;
		return errors;
	}

	handleSubmit = e =>{
		e.preventDefault();
		const errors = this.validate();
		this.setState( { errors: errors || {} })
		if (errors)return;
		//calling the server
		this.doSubmit();
	}

	renderButton(label,loading){
		return (
			<div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
				<button
						disabled = {loading || this.validate()}
						type="submit"
						className="py-2 px-4 bg-bgcolor font-medium mb-4  hover:text-white hover:bg-additional rounded-md disabled:opacity-50"
						style={{cursor:"pointer"}}
					>
						{ label }
				</button>
			</div>
		)
	}
	renderInput(name,label,type='text'){
		const { data, errors } = this.state;
		return <Input
					name={name}
					type={type}
					value={ data[name] }
					onChange={ this.handleChange }
					label={label}
					error={errors[name]} />
	}


}

export default Form;
