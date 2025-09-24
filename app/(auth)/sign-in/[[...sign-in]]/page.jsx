import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="">
                <img alt="" src="https://images.pexels.com/photos/30885553/pexels-photo-30885553.jpeg" className="absolute inset-0 h-full w-full object-cover" />
        <div className="flex place-content-center justify-center items-center flex-col h-screen">
            <SignIn/>
        </div>
    </section>
  )
}