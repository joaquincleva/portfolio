import Image from "next/image"

interface LogoProps {
    fill: string,
    width: string,
    height: string
}

const Logo = ({ fill, height, width }: LogoProps) => {
    return (
        <svg className="rounded-full" version="1.0" xmlns="http://www.w3.org/2000/svg"
            width={width} height={height} viewBox="0 0 190.000000 190.000000"
            preserveAspectRatio="xMidYMid meet">

            <g transform="translate(0.000000,190.000000) scale(0.100000,-0.100000)"
                fill={fill} stroke="none">
                <path d="M0 950 l0 -950 950 0 950 0 0 950 0 950 -950 0 -950 0 0 -950z m731
500 c75 -14 206 -81 254 -129 l39 -41 -221 0 c-193 0 -229 -2 -284 -20 -96
-30 -160 -85 -210 -180 -20 -38 -24 -59 -24 -140 0 -84 3 -101 27 -146 103
-196 358 -253 533 -119 l32 24 62 -63 62 -63 -37 -33 c-49 -42 -164 -97 -233
-110 -326 -61 -630 180 -631 500 0 156 45 266 154 376 123 123 301 177 477
144z m1069 -85 l0 -85 -155 0 -155 0 0 -27 c0 -16 0 -200 0 -410 l0 -383 -95
0 -95 0 0 410 0 410 -103 0 -103 0 -49 50 c-28 28 -71 65 -97 82 -27 16 -48
32 -48 34 0 2 203 4 450 4 l450 0 0 -85z"/>
            </g>
        </svg>)
}

export default Logo