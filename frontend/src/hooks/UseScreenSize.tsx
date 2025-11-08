import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobilePhone, setIsMobilePhone] = useState(false);
  const [isMobilePhoneMedium, setIsMobilePhoneMedium] = useState(false);
  const [isMobileTablet, setIsMobileTablet] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the threshold value as per your needs
      setIsMobilePhone(window.innerWidth <= 600); // Only true when is a mobile phone
      setIsMobilePhoneMedium(window.innerWidth <= 425); // Only true when is a medium mobile phone
      setIsMobileTablet(window.innerWidth >= 600 && window.innerWidth <= 1024); // Only true when is a tablet
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };

    window.addEventListener(`resize`, handleResize);
    handleResize();

    return () => {
      window.removeEventListener(`resize`, handleResize);
    };
  }, []);

  return { isMobile, innerWidth, innerHeight, isMobilePhone, isMobileTablet, isMobilePhoneMedium };
};

export default useScreenSize;
