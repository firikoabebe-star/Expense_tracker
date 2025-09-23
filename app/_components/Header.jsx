import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='p-5 justify-between flex items-center border shadow-sm'>
      <Image src={'./logo.svg'}
      alt='logo'
      width={100}
      height={50}
      />
      <Button>Get Started</Button>
    </div>
  )
}

export default Header
