import styled from "styled-components";
import {useState} from "react"
import { useAuth } from '../contexts/AuthProvider'
import { useLang } from '../contexts/LangProvider'


import { firestore as db} from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
// animation:
import {motion} from "framer-motion";
import {dropIn} from "../animation";

const Signaler = ({setSignaler}) => {
	const { currentUser, currentUserInfo } = useAuth();
	const { setting, currentLang } = useLang();
	
	const [value, setValue]=useState("");

	const change = (e) => {
		setValue(e.target.value)
	}
	const exit = (e) => {
		if(e.target.classList.contains("model")){
			setSignaler(false);
		}
	}

	const submit = () => {
		console.log({reportMessage: value})
		// create the doc
		const dbRef = collection(db, "reports");
		const  id = window.location.href.split('/').at(-1) // get the last item in the array
		const data = {

			reportDetails: value,
			reportId: null,
			reportType: "ReportType.ProfileReport",
			reportedPortfolioItemId: null,
			reportedProfileId: id,
			reportedRatingId: null,
			reporterId: currentUser?.uid,
		}

		console.table(data);
		//return;

		addDoc(dbRef, data)
			.then(docRef => {
			    	console.log("Document has been added successfully");
			    	setValue("");
				setSignaler(false);

			})
			.catch(error => {
			    console.log(error);
			})
	}


	return(
		<Model
			variants={dropIn}
      			initial="hidden"
      			animate="show"
      			exit="exit"
			className="model"
			onClick={exit}
			>
			<Form>
				<h1>Report User</h1>
				<textarea
					onChange={change}
					value={value}
				></textarea>
				<div className="btns">

					<button
						className="cancel"
						onClick={()=>setSignaler(false)}		
					>
						cancel
					</button>
					<button
						onClick={submit}		
					>
						Submit
					</button>
				</div>
			</Form>
		</Model>
	);

}

const Model = styled(motion.div)`

	position: fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	background: rgba(0,0,0,0.7);
	display: grid;
	place-items: center;
	z-index:2000;
`;

const Form = styled.div`
	width: min(90%,500px);
	height:400px;

	padding: 0.5rem 1rem;
	background: white;
	border-radius: .5rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	h1 {
		margin: 1rem auto;
		font-size: 30px;

	}

	textarea {
		margin: 1rem auto;
		padding: .5rem 1rem;
		width: 90%;
		height: 250px;
		font-size: 20px;
		border: 1px solid gray;
		border-radius: .5rem;
		resize: none;
		outline: none;

	}

	.btns {
		width: 90%;
		padding: 0.5rem 1rem;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}

	button {
		margin: .5rem auto;
		width: auto;
		padding: .5rem 1rem;
		border: 1px solid gray;
		color: gray;
		border-radius: .3rem;
		transition: all .3s ease;
		&:hover {
			background: gray;
			color: white;
			transition: all .3s ease;
		}
		&.cancel {
			color: rgb(250,10,10);
			border-color: rgb(255,10,10);
			transition: all .3s ease;
			&:hover {
				background: rgba(255,10,10);
				color: white;
				transition: all .3s ease
			}
		}
	}
`;

export default Signaler;







