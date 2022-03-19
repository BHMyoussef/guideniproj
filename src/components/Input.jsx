export default function Input({name, type ,value, label, onChange,error}){
	return(
		<div className="mb-4 w-full">
			<label
                className="inline-block text-lg font-medium "
                htmlFor = { name }>{ label }</label>
			<input
				value={value}
				onChange={onChange}
				name={ name }
				type={ type }
				id={ name }
				className={`border-2 rounded-md outline-none py-1 px-2 w-full`} />
			{ error && <div className="bg-red-400 mt-2 py-2 px-4 text-white font-medium" >{ error }</div> }
		</div>

	);
}
