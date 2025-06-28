import { Box } from "@radix-ui/themes"

export default function Blob({...props}:any) {
  return (
    <Box
      
      display={{initial:'none', md:'block'}}
      style={{
        backgroundImage:'radial-gradient(#008080 0%, rgba(94, 208, 234, 0) 60%)', 
        zIndex:0, 
        opacity:0.2,
        width:"1000px",
        height:"800px",
        position:"absolute",
        pointerEvents:"none",
        flexShrink:0
    }}
      {...props}
    />
  )
}