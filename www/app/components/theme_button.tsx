'use client'

import { useConfigStore } from '@/zustand/store';
import { IconButton } from '@radix-ui/themes';
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";

export default function ThemeButton({...rest}:any) {
    const {appTheme, setAppTheme} = useConfigStore()
    // const { colorMode, toggleColorMode } = useColorMode()
    return (<>
        <IconButton {...rest} size={'2'} color={'gray'} variant={'outline'} aria-label={'Theme'} onClick={()=>{setAppTheme(appTheme=='light'?'dark':'light')}}>
        {appTheme=='dark'?<BsMoonStarsFill />:<BsFillSunFill/>}
        </IconButton>
    </>)
}