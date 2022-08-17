import styled from "styled-components";

// import icons
import {MdReport} from "react-icons/md"
import {FaWindowClose, FaHeart, FaInfoCircle} from "react-icons/fa"


const DotsMenu = ({titles, setOpenMenu, setRatMe, setSignaler}) => {

	const handleExit = (e) => {
		if(e.target.classList.contains("container"))
			setOpenMenu(false);
	}



	return (
		<Container
		onClick={handleExit}
		className="container">
			<Wrapper>
				<Divs 
					onClick={()=>setOpenMenu(false)}
					className={`close`}>
					<div className="icon"><FaWindowClose size="22" /></div>
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


const Container = styled.div`
	position: fixed;
	width: 100%;
	margin: 0;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: grid;
	place-items: center;
	cursor: pointer;
	background: #00000050;
	backdrop-filter: blur(5px);


`

const Wrapper = styled.div`
	width: 450px;
	z-index:10;
	padding: 1rem;
	background: white;
	border: 1px solid gray;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0px 2px 10px #00000030;

`
const Divs = styled.div`
	width: 90%;
	margin: 0.5rem auto;
	border:none;
	border-bottom: 1px solid #00000030;
	border-radius: 0px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-size: 24px;
	color: black;
	transition: all .3s ease;
	&.close {
		border:none;
		justify-content: end;
	}
	&:not(.close):hover {
		transition: all .3s ease;
		scale: 1.1;

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


`















export default DotsMenu;
