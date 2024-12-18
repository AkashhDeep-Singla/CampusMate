import React from 'react'

const Hero = () => {
    return (
        <div className='flex items-center justify-center w-full'>
            <div className='relative h-[80vh] w-[80vw] my-[2vh] rounded-3xl overflow-hidden flex flex-col items-center gap-20 px-10' style={{ backgroundImage: 'url(/about.webp)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

                <div className='w-full h-full bg-black absolute opacity-50'></div>

                <div className='flex gap-x-10'>
                    <h1 className='text-[5rem] font-bold hidden lg:block z-20 text-yellow-50'>Welcome<span className='text-pink-500'>!</span></h1>
                    <h1 className='text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold z-20 text-yellow-50'>Akashdeep Singla</h1>
                </div>
                <div className='grid grid-cols-2 gap-x-20'>
                    <div className='flex flex-col items-center gap-2 md:gap-10'>
                        <p className='text-xl hidden lg:block text-white z-20 font-semibold'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia non accusamus cum vel alias est repellendus sunt fugit neque libero amet quis quos, debitis quibusdam nam illum sapiente provident nesciunt?</p>
                    </div>
                    <div className='flex flex-col items-center gap-20 text-white z-20 font-semibold'>
                        <p className='text-xl hidden lg:block text-right'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia non accusamus cum vel alias est repellendus sunt fugit neque libero amet quis quos, debitis quibusdam nam illum sapiente provident nesciunt?</p>
                        <button className='bg-pink-500 text-white h-10 px-8 rounded-3xl z-20'>Book Room</button>
                    </div>
                </div>
                <div className='absolute w-[40vw] h-[40vw] lg:w-[30vw] lg:h-[30vw] bg-black rounded-full left-[35vw]   lg:left-[25vw] bottom-40 lg:-bottom-20 border-white border-8 z-20' style={{ backgroundImage: 'url(/Profile.jpg)', backgroundSize: 'cover' }}>

                </div>
            </div>
        </div>
    )
}

export default Hero
