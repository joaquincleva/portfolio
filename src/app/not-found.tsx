import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="gradient- relative pt-20 w-full bg-white h-auto z-10 justify-center flex items-center flex-col">
      <h1 className='pt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold'>Not found – 404! <Link className='font-medium hover:underline hover:text-[#de942c] transition-all duration-300' href="/">Go back to Home</Link></h1>
      <img src="/not-found.png" width={405} alt="404" />
    </div>
  )
}