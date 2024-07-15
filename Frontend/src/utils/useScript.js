import { useEffect } from "react";

const useScript = (url, id) => {
    useEffect(() => {
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.async = true;
  
      document.head.appendChild(script);
  
      return () => {
        document.head.removeChild(script);
      };
    }, [url, id]);
  };
  
  export default useScript;