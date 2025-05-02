import LoaderApp from 'react-ts-loaders'
import { cn } from "@/lib/utils.ts";

interface Props {
    fullscreen?: boolean
}

export const Loader = ({fullscreen}: Props) => {
  return (
    <div className={cn(
        "flex items-center justify-center",
        fullscreen && "h-screen"
    )}>
      <LoaderApp
        type="roller"
        color="rgb(29, 78, 216)"
        size={60}
      />
    </div>
  )
  
}
