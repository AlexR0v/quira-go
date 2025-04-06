import {useGetCurrentUser} from "@/app/api/query-hooks/useUser.tsx";
import {Loader, LogOut} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useLogout} from "@/app/api/query-hooks/useAuth.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export const UserButton = () => {

    const {data: user, isLoading} = useGetCurrentUser()
    const {mutate: userLogout} = useLogout()

    const userFallback = user ? (user?.first_name[0].toUpperCase() + user?.last_name[0].toUpperCase()) : 'U'

    if (isLoading) {
        return (
            <div
                className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground"/>
            </div>
        )
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                    <AvatarFallback
                        className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                        {userFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
                <div className="flex flex-col items-center justify-center gap-2 px2.5 py-4">
                    <Avatar className="size-[52px] border border-neutral-300">
                        <AvatarFallback
                            className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                            {userFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-neutral-900">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <Separator className="mb-1"/>
                <DropdownMenuItem
                    onClick={() => userLogout()}
                    className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
                    <LogOut className="mr-2 size-4"/>
                    Выход
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}