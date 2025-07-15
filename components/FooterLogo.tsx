'use client';

import React from 'react'
import Image from 'next/image'

export default function FooterLogoSwitch() {
    // `showLogo = true` → show logo; `false` → show brand name


    return (
        <footer className="footer-logo-wrap flex-start fixed  flex  p-1 ">
            <div className="footer-switch">



                <div
                    key="logo"
                    className="f-logo flex items-center justify-center oc-ft-logo"
                >
                    <Image src="/OmidCity.svg"
                        alt="شهر مجازی امید" width={170} height={170} />
                    {/* <p style={{fontSize:'.8rem'}}>شهر امید</p> */}
                </div>


            </div>
        </footer>
    )
}
