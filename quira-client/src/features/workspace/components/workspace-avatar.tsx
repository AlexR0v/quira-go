import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";

interface Props {
    image?: string
    name: string
    className?: string
}

export const WorkspaceAvatar = ({ image, className, name }: Props) => {
    if (image) {
        return (
            <div className={cn(
                "size-8 relative rounded-md overflow-hidden flex items-center justify-center",
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
        <Avatar className={cn("size-8", className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg">
                {name[0]?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}