import {TUser} from "@/models/user.ts";
import {TWorkspace} from "@/models/worksapce.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeftIcon, MoreVerticalIcon} from "lucide-react";
import {useNavigate} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";
import {Fragment} from "react";
import {ResponseMembers, RoleMember} from "@/models/members.ts";
import {MemberAvatar} from "@/features/members/components/member-avatar.tsx";
import {cn} from "@/lib/utils.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useMemberDelete, useMemberUpdateRole} from "@/app/api/query-hooks/useMembers.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useConfirm} from "@/hooks/use-confirm.tsx";

interface Props {
    members: ResponseMembers
    currentUser: TUser
    workspace: TWorkspace
}

export const MembersList = ({members, currentUser, workspace}: Props) => {

    const navigate = useNavigate()

    const isCurrentUserAdmin = members.users.some(user => user.id === currentUser.id && user.role === "ADMIN")
    const isOneAdmin = members.users.filter(user => user.role === "ADMIN").length === 1

    const {mutate: updateRole, isPending: isUpdateRolePending} = useMemberUpdateRole()
    const {mutate: deleteMember, isPending: isDeleteMemberPending} = useMemberDelete()

    const [DialogDelete, confirmDelete] = useConfirm(
        "Участник будет удален",
        "Вы уверены, что хотите удалить участника?",
        "destructive"
    )

    const onUpdateMember = (value: "ADMIN" | "USER", userId: string) => {
        updateRole({
            user_id: userId,
            workspace_id: workspace.id.toString(),
            role: value === "ADMIN" ? RoleMember.ADMIN : RoleMember.USER
        })
    }

    const onDeleteMember = async (userId: string) => {
        const ok = await confirmDelete()
        if(!ok) return
        deleteMember({
            workspace_id: workspace.id.toString(),
            user_id: userId
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <DialogDelete/>
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button variant="secondary" size="sm" onClick={() => navigate(`/`)}
                        type="button">
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Назад
                </Button>
                <CardTitle className="text-xl font-bold">
                    Список участников
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator/>
            </div>
            <CardContent className="p-7">
                {members.users.map((member, index) => (
                    <Fragment key={member.id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar
                                firstName={member.first_name}
                                lastName={member.last_name}
                                className={cn("size-10", member.id === currentUser.id && "border-blue-400")}
                                fallbackClassName={cn("text-lg", member.id === currentUser.id && "bg-blue-300 text-white")}
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">
                                    {member.first_name} {member.last_name}
                                    <Badge className="ml-2">{member.role}</Badge>
                                </p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="ml-auto"
                                        size="icon"
                                        variant="secondary"
                                    >
                                        <MoreVerticalIcon className="size-4 text-muted-foreground"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    {isCurrentUserAdmin ? (
                                        <>
                                            {member.role === "ADMIN" && !isOneAdmin ? (
                                                    <DropdownMenuItem
                                                        className="font-medium"
                                                        onClick={() => onUpdateMember("USER", member.id.toString())}
                                                        disabled={isUpdateRolePending || isDeleteMemberPending}
                                                    >
                                                        Перевести в участники
                                                    </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="font-medium"
                                                    onClick={() => onUpdateMember("ADMIN", member.id.toString())}
                                                    disabled={isUpdateRolePending || isDeleteMemberPending}
                                                >
                                                    Перевести в администраторы
                                                </DropdownMenuItem>
                                            )}
                                            {member.role === "ADMIN" && isOneAdmin ? null : (
                                                <DropdownMenuItem
                                                    className="font-medium text-amber-700"
                                                    onClick={() => onDeleteMember(member.id.toString())}
                                                    disabled={isUpdateRolePending || isDeleteMemberPending}
                                                >
                                                    Удалить участника
                                                </DropdownMenuItem>
                                            )}
                                        </>
                                    ) : (
                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={() => {
                                            }}
                                            disabled={false}
                                        >
                                            Действия доступны только для администратора
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < members.users.length - 1 && <Separator className="my-2.5"/>}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}