import { Link } from 'react-router-dom';

export default function Service({id, icon, name,toLink}){
    return (
        <Link to={`/${toLink}/${id}` }  className='pt-4 pb-4 px-8 text-center bg-secondary hover:scale-105 transition-all ease-in rounded-xl'>
            <img  className='block w-8/12 mx-auto' src={ icon } alt="service" />
            <span className='block text-xl font-bold text-white'>{ name }</span>
        </Link>
    )
}