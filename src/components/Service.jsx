import { Link } from 'react-router-dom';



export default function Service({id, icon, name,toLink}){
    return (
        <Link
            to={`/${toLink}/${id}` }  
            className='pt-4 pb-4 px-8 text-center bg-white border-[1px] shadow-xl border-gray-200 m-1  hover:scale-103 transition-all ease-in rounded-xl'>
            <img  className='block w-8/12 mx-auto' src={ icon } alt="service" />
            <span className='block text-xl font-bold '>{ name }</span>
        </Link>
    )
}