import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";

interface Props {
    image?: string
    name: string
    className?: string
    fallbackClassName?: string
}

export const ProjectAvatar = ({ image, className, name, fallbackClassName }: Props) => {
    if (image) {
        return (
            <div className={cn(
                "size-5 relative rounded-md overflow-hidden flex items-center justify-center",
                className,
            )}>
                <img
                    src={image}
                    className="object-cover"
                    alt='logo'
                />
            </div>
        )
    }

    return (
        <Avatar className={cn("size-5", className)}>
            <AvatarFallback className={cn(
                "text-white bg-blue-600 font-semibold text-sm",
                fallbackClassName
            )}>
                {name[0]?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}