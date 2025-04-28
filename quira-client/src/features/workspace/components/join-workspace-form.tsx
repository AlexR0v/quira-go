import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {TWorkspace} from "@/models/worksapce.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemberJoin} from "@/app/api/query-hooks/useMembers.tsx";
import {useNavigate, useParams} from "react-router";

interface Props {
    initialValues: TWorkspace
}

export const JoinWorkspaceForm = ({initialValues}: Props) => {

    const {mutateAsync, isPending} = useMemberJoin()
    const {id, code} = useParams()
    const navigate = useNavigate()

    const onJoin = async () => {
        if (id && code){
            await mutateAsync({
                workspace_id: id,
                invite_code: code
            })
        }
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Присоединиться к проекту
                </CardTitle>
                <CardDescription>
                    Вы были приглашены в проект <strong>{initialValues.name}</strong>
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <Separator/>
            </div>
            <CardContent className="p-7">
                <div className="flex items-center justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/")}
                        disabled={isPending}
                    >
                        Отменить
                    </Button>
                    <Button
                        onClick={onJoin}
                        disabled={isPending}
                    >
                        Присоединиться
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}