'use client'

import { useConfigStore } from '@/zustand/store';
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";

export default function ThemeButton({...rest}:any) {
    const {appTheme, setAppTheme} = useConfigStore()
    // const { colorMode, toggleColorMode } = useColorMode()
    return (<>
        <button 
            {...rest} 
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
            aria-label={'Theme'} 
            onClick={()=>{setAppTheme(appTheme=='light'?'dark':'light')}}
        >
        {appTheme=='dark'?<BsMoonStarsFill />:<BsFillSunFill/>}
        </button>
    </>)
}