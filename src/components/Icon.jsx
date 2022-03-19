export default function Icon({ icon,children }){
    return (
        <span className='cursor-pointer group'>
            { icon }
            { children }
        </span>
    )
}