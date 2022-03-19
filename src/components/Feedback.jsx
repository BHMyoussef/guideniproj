import Stars from "./Stars";

export default function FeedBack({image, name, rateDetails, rate}){
    return (
      <div className='feedback flex items-center pt-4 pb-4 border-t-2 border-secondary'>
        <div className='image-container w-28 h-28'>
            <img 
                className='h-full w-full rounded-full'
                src={image ||`${window.location.origin}/resources/profile.png`} 
                alt="profile photo" 
            />
        </div>
        <div className='ml-8'>
          <h3>{name}</h3>
          <p>{rateDetails}</p>
          <Stars rate={rate} />
        </div>
      </div>
    )
  }