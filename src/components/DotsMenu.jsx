import styled from "styled-components";

// import icons
import {MdReport} from "react-icons/md"
import {FaWindowClose, FaHeart, FaInfoCircle} from "react-icons/fa"

// animation
import {motion} from "framer-motion";

import {dropIn} from "../animation";


const DotsMenu = ({titles, setOpenMenu, setRatMe, setSignaler}) => {

	const handleExit = (e) => {
		if(e.target.classList.contains("container"))
			setOpenMenu(false);
	}



	return (
		<Container
			variants={dropIn}
      			initial="hidden"
      			animate="show"
      			exit="exit"
			onClick={handleExit}
			className="container">
			<Wrapper>
				<Divs 
					onClick={()=>setOpenMenu(false)}
					className={`close`}>
					<div className="icon"><FaWindowClose size={30} /></div>
				</Divs>
				<Divs>
					<div className="text">
						{titles?.addtofav}
					</div>
					<div className="icon">
						<FaHeart color="red" size={30}/>
					</div>
				</Divs>
				<Divs
					onClick={() => setRatMe(true)}	
				>
                                        <div className="text">
						{titles?.feedback}
                                        </div>
                                        <div className="icon">
                                                <FaInfoCircle color="skyblue" size={30} />
                                        </div>
                                </Divs>
				<Divs
					onClick={() => setSignaler(true)}
				>
                                        <div className="text">
						{titles?.report}
                                        </div>
                                        <div className="icon">
                                                <MdReport color="orange" size={30} />
		
                                        </div>
                                </Divs>

			</Wrapper>
		</Container>

	)

}


const Container = styled(motion.div)`
	position: fixed;
	z-index:10;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: grid;
	place-items: center;
	cursor: pointer;
	backdrop-filter: blur(5px);
	margin: 0 auto;


`

const Wrapper = styled.div`
	width: min(80%,500px);
	z-index:10;
	padding: 1rem;
	padding-bottom: 2rem;
	background: white;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0px 2px 15px #00000030;

`
const Divs = styled.div`
	width: 90%;
	margin: 1rem auto;
	border:none;
	border-bottom: 1px solid #00000030;
	border-radius: 0px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-size: 18px;	
	color: black;
	transition: all .3s ease;
	position: relative;
	&.close {
		border:none;
		justify-content: end;
	}
	&:not(.close):hover {
		transition: all .3s ease;
		scale: 1.1;

		&:before {
			width: 7px;
			transition: all .3s ease;
		}
	}
	
	&:not(.close):before {
		transition: all .3s ease;
		content:"";
		position: absolute;
		top:0;
		left:0;
		width: 0px;
		height: 100%;
		background: gray;
	}

	/* divs inside: */
	div {
		cursor: pointer;
		padding: .5rem 1rem;
	}
	.text {
		flex: 1;
	}
	.icon {
		margin:0 .5rem;
	}

	/* close Icon: */
	&.close {
		position: relative;
		margin-botton: 1rem;
		padding: 2rem;
		div {
			position: absolute;
			top: -1rem;
			right: -3rem;
		}
	}




`















export default DotsMenu;
