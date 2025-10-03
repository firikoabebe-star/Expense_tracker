import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
   <section className="">
    <img 
        alt="" 
        src="/Finance.jpg" 
        className="absolute inset-0 h-full w-full object-cover blur-xs" 
    />
    <div className="flex place-content-center justify-center items-center flex-col h-screen">
        <SignIn/>
    </div>
</section>
  )
}