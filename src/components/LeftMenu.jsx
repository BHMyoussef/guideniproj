
import {FaInfoCircle, FaHeart, FaShareAlt} from 'react-icons/fa'
import {MdReport} from 'react-icons/md'
import Share from '../components/Share';

/* Animation */
import { motion} from "framer-motion"
import {scaling} from "../animation";

const LeftMenu = ({setRatMe, usersInfoTxt}) => {


	return (

		<motion.div

	      	variants={scaling}
	      	initial="hidden"
	      	animate="show"
			id="dropdownLeft"
			className="z-20 rounded left-[-120%] absolute bg-white divide-y divide-gray-100 rounded shadow w-[200px]" >
		    <ul className="py-2 flex flex-col justify-around">
		      <li className="w-full py-[.5rem]">
		        <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-500 hover:text-white">
		        	<h2 className="text-2x">Add to Favorite</h2>
		        	<FaHeart className="pl-2" size={35} color='red' />
		        </div>
		      </li>

		      <li  className="w-full py-[.5rem]">
		        <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-500 hover:text-white">
		        	<h2 className="text-2x">
		        		
				        <button className="" onClick={() => { setRatMe(true) }}>
		                {usersInfoTxt && usersInfoTxt.feedBackOrder}
		              </button>
		        	</h2>
		        	<FaInfoCircle className="pl-2" size={35} color='skyblue' />
		        </div>
		      </li>

		      <li  className="w-full">
		        <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-500 hover:text-white">
		        	<h2 className="text-2x">Report user</h2>
		        	<MdReport className="pl-2" size={35} color='orange' />
		        </div>
		      </li>


		    </ul>
		</motion.div>

	)
}

export default LeftMenu;