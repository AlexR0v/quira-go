import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";

interface Props {
    firstName: string
    lastName: string
    className?: string
    fallbackClassName?: string
}

export const MemberAvatar = ({ fallbackClassName, className, firstName, lastName }: Props) => {
    return (
        <Avatar className={cn("size-5 border transition border-neutral-300 rounded-full", className)}>
            <AvatarFallback className={cn("bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center", fallbackClassName)}>
                {firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}