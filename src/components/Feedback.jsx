import Stars from "./Stars";

export default function FeedBack({ image, name, rateDetails, rate, rank }) {

  console.log({rank})
  return (
    <div  className="bg-white w-full flex items-center p-2 mx-auto my-[1rem] rounded-xl shadow border">
    <div className="relative flex items-center space-x-4">
      <img 
        src={image || `${window.location.origin}/resources/profile.png`}
        alt={name}
         className="w-[100px] h-[100px] rounded-full" 
         />
    </div>
    <div className="flex-grow p-3 ml-5">
      <div className="relative font-semibold text-gray-700">
        {name}
        <span className="absolute rounded-full w-[40px] h-[40px] top-0 right-[-1rem]">
          <img
            src={`${window.origin}/resources/rank/${rank.toString()?.toLowerCase()}.svg`}
            alt={`rank ${rank}`}
          />
      </span>
      </div>

      <div className={`text-sm text-gray-500 ${(rank?.toLowerCase() === 'gold' ? 'text-[#ffd700]' : (rank?.toLowerCase() === 'silver' ? ' text-[#c0c0c0]' : 'text-[#cd7f32]'))}`}>
        {rank?.toUpperCase()}
      </div>
      
      <div className="text-sm text-gray-500">
        <Stars rate={rate} />
      </div>

      <div className="font-sm text-gray-500">
        {rateDetails}
      </div>
    </div>
    {/* we may need it if he asked us to add s.th here
      <div className="p-2">
          <span className="block rounded-full self-start top-[-2rem] right-0">
            ...
          </span>
    </div>
          */
    }
  </div>
  )
}

/**


<div className='feedback flex items-center pt-4 pb-4 border-t-2 border-secondary'>
      <div className='image-container w-28 h-28'>
        <img
          className='h-full w-full rounded-full'
          src={image || `${window.location.origin}/resources/profile.png`}
          alt="profile photo"
        />
      </div>
      <div className='ml-8'>
        <h3>{name}</h3>
        <p>{rateDetails}</p>
        <Stars rate={rate} />
      </div>
    </div>
 */
