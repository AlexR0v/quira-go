import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

interface Props {
    title: string;
    value: number;
    variant: "up" | "down";
    increaseValue: number;
}

export const AnalyticCard = ({ title, value, variant, increaseValue }: Props) => {

    const iconColor = variant === "up" ? "text-emerald-600" : "text-red-600";
    const increaseValueColor = variant === "up" ? "text-emerald-600" : "text-red-600";
    const Icon = variant === "up" ? FaCaretUp : FaCaretDown

    return (
        <Card className="shadow-none border-none w-full">
            <CardHeader>
                <div className="flex items-center gap-x-2.5">
                    <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
                        <span className="truncate text-base">{title}</span>
                    </CardDescription>
                    <div className="flex items-center gap-x-1">
                        <Icon className={cn(iconColor, "size-4")}/>
                        <span className={cn(increaseValueColor, "truncate text-base font-medium")}>
                            {increaseValue}
                        </span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
            </CardHeader>
        </Card>
    )
}