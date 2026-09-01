import Image from 'next/image'
import React from 'react'

interface LogoProps{
    w: number,
    h: number
}

const Logo = ({w, h}: LogoProps) => {
    return (
        <div>
            <Image
                src="/images/logo.jpg"
                width={w}
                height={h}
                alt="KnowledgePulse"
                className="rounded-full"
            />
        </div>
    )
}

export default Logo;