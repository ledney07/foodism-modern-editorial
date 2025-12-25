import React from 'react';

type LogoProps = {
  className?: string;
  variant?: 'black' | 'white';
  onClick?: () => void;
};

const Logo = ({ className = 'h-8 md:h-10 w-auto', variant = 'black', onClick }: LogoProps): React.ReactElement => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    if (onClick) {
      onClick();
    }
  };

  const textFill = variant === 'white' ? 'fill-white' : 'fill-black';
  const starFill = variant === 'white' ? 'fill-[#f9b233]' : 'fill-[#f9b233]';
  const hoverTextFill = variant === 'white' 
    ? 'group-hover:fill-[#f9b233]' 
    : 'group-hover:fill-[#f9b233]';
  const hoverStarFill = variant === 'white' 
    ? 'group-hover:fill-white' 
    : 'group-hover:fill-black';

  return (
    <a 
      href="#"
      onClick={handleClick}
      className="inline-block cursor-pointer"
      aria-label="Foodism CA - Go to homepage"
    >
      <svg 
        className={`logo ${className}`}
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px" 
        viewBox="0 0 370 65"
      >
      <title>Foodism CA</title>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 338.905,33.995 c 0,-10.09 -3.77,-15.79 -12.19,-15.79 -12.11,0 -14.56,9.56 -14.56,9.56 -1.58,-6.32 -6.05,-9.56 -11.93,-9.56 -11.76,0 -14.39,8.95 -14.39,8.95 v -8.07 h -20.26 v 0.97 h 5 v 42.53 h -5 v 0.97 h 24.3 v -0.97 h -4.03 v -30.96 c 0,-6.23 2.63,-9.74 6.14,-9.74 2.54,0 5,1.75 5,6.14 v 34.55 h -3.6 v 0.97 h 23.07 v -0.97 h -4.04 v -30.96 c 0,-6.23 2.63,-9.74 6.14,-9.74 2.54,0 5,1.75 5,6.14 v 24.04 c 0,8.42 5.53,12.46 11.32,12.46 7.54,0 10.96,-5 11.14,-10.53 h -0.35 c -0.09,2.81 -1.32,4.82 -3.51,4.82 -2.54,0 -3.25,-1.58 -3.25,-5.35 v -19.47 z"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 229.955,58.555 c 3.16,0 5.35,-1.93 5.35,-5.17 0,-3.42 -2.19,-5.7 -6.32,-5.7 -3.86,0 -6.4,2.72 -6.4,6.32 0,5.79 4.47,10.44 16.14,10.44 15.35,0 22.46,-6.32 22.46,-15.35 0,-19.03 -23.51,-10.53 -23.51,-23.33 0,-4.21 2.63,-6.93 7.72,-6.93 8.16,0 12.89,6.49 14.3,15.88 h 0.26 v -16.4 h -0.26 c -0.18,2.02 -1.4,2.54 -2.54,2.54 -3.24,0 -6.67,-2.81 -14.56,-2.81 -14.39,0 -19.12,7.28 -19.12,15.09 0,17.46 23.16,10.88 23.16,23.69 0,4.39 -3.77,7.19 -10.09,7.19 -7.54,0 -11.4,-3.77 -11.4,-6.58 0,-0.26 0.18,-0.44 0.44,-0.44 0.7,0 2.02,1.58 4.39,1.58"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 213.465,7.8550001 c 0,-4.04 -3.33,-6.58 -7.98,-6.58 -4.65,0 -8.33,2.72 -8.33,6.76 0,4.0399999 3.33,6.7499999 8.07,6.7499999 4.74,0 8.24,-2.89 8.24,-6.9299999"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 218.195,63.555 v -0.97 h -5 v -43.5 h -20.7 v 0.97 h 5.18 v 42.53 h -5.18 v 0.97 z"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 168.545,50.755 c 0,7.28 -2.81,9.3 -5.53,9.3 -5.35,0 -7.37,-5.97 -7.37,-18.68 0,-12.71 2.02,-20.09 7.37,-20.09 2.54,0 5.53,2.02 5.53,9.03 z m 22.37,3.24 c 0,2.89 -1.49,4.82 -3.68,4.82 -2.54,0 -3.33,-1.84 -3.33,-5.61 V 2.1550001 h -21.49 v 0.97 h 6.14 V 25.485 c 0,0 -2.37,-7.54 -12.37,-7.54 -10,0 -16.58,9.74 -16.58,23.86 0,14.12 6.4,22.63 16.58,22.63 10.18,0 12.81,-10.18 12.81,-10.18 1.67,6.75 5.79,10.18 11.58,10.18 7.46,0 10.61,-4.91 10.61,-10.44 h -0.26 z"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 109.165,64.175 c -5.18,0 -7.02,-8.25 -7.02,-23.16 0,-14.91 1.84,-22.63 7.46,-22.63 5,0 6.84,7.98 6.84,23.07 0,15.09 -1.93,22.72 -7.28,22.72 m 23.42,-23.25 c 0,-13.95 -9.47,-22.81 -22.98,-22.81 -13.51,0 -23.6,9.39 -23.6,23.42 0,14.03 9.47,22.9 23.16,22.9 13.69,0 23.42,-9.47 23.42,-23.51"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 55.565,64.175 c -5.17,0 -7.02,-8.25 -7.02,-23.16 0,-14.91 1.84,-22.63 7.46,-22.63 5,0 6.84,7.98 6.84,23.07 0,15.09 -1.93,22.72 -7.28,22.72 m 23.42,-23.25 c 0,-13.95 -9.47,-22.81 -22.98,-22.81 -13.51,0 -23.6,9.39 -23.6,23.42 0,14.03 9.47,22.9 23.16,22.9 13.69,0 23.42,-9.47 23.42,-23.51"></path>
      <path className={`${textFill} ${hoverTextFill} transition-colors duration-300`} d="m 21.615,0.48500011 c -8.51,0 -14.65,5.69999999 -14.65,14.29999989 v 4.34 h -5.97 v 0.89 h 5.97 v 42.61 h -5.97 v 0.93 h 27.9 v -0.93 h -5.79 v -27.84 c 0,-5.97 -0.79,-10.65 -2.45,-14.77 h 10.26 v -0.89 h -10.65 c -1.68,-3.89 -3.47,-6.8 -3.47,-10.9199999 0,-4.12 2.54,-7.1 6.93,-7.1 4.12,0 6.58,2.1 6.58,4.39 0,0.26 -0.18,0.44 -0.53,0.44 -0.26,0 -1.67,-0.88 -3.33,-0.88 -3.07,0 -5.35,2.02 -5.35,5.0899999 0,3.25 2.1,5.35 5.53,5.35 3.43,0 6.14,-2.63 6.14,-6.5799999 0,-4.82 -3.68,-8.41999999 -11.14,-8.41999999"></path>
      <path className={`${starFill} ${hoverStarFill} transition-colors duration-300`} d="m 355.365,23.735 7.89,1.19 -1.48,-2.85 7.23,-6.73 -2.56,-0.74 1.43,-3.7 -4.22,0.85 -0.51,-2.4499999 -4.73,3.6499999 2.51,-7.9199999 -3.08,1.54 -3.28,-4.99 -3.27,4.99 -3.08,-1.54 2.5,7.9199999 -4.73,-3.6499999 -0.51,2.4499999 -4.22,-0.85 1.43,3.7 -2.57,0.74 7.24,6.73 -1.48,2.85 7.89,-1.19"></path>
      <path className={`${starFill} ${hoverStarFill} transition-colors duration-300`} d="m 345.875,24.925 h 17.38 l -9.41,-4.82"></path>
      <path className={`${starFill} ${hoverStarFill} transition-colors duration-300`} d="m 353.915,24.39501 h 1.31 v 3.59 h -1.31 z"></path>
      </svg>
    </a>
  );
};

export default Logo;

