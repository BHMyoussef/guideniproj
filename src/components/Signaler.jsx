import styled from "styled-components";
import {useState} from "react"

const Signaler = () => {
	
	const [value, setValue]=useState("");

	const change = (e) => {
		setValue(e.target.value)
	}
	const submit = () => {
		console.log({report: value})
	}


	return(
		<Model>
		<Form>
			<h1>title:</h1>
			<textarea
				onChange={change}
				value={value}
			></textarea>
			<button
				onClick={submit}		
			>
				Submit
			</button>
		</Form>
		</Model>
	);

}

const Model = styled.div`

	position: fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	background: rgba(0,0,0,0.7);
	display: grid;
	place-items: center;
	color: red;

`;

const Form = styled.div`
	padding: 0.5rem 1rem;
	background: white;
	border-radius: 1rem;

`;

export default Signaler;







