import { ResponseTask } from "@/models/task.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { AnalyticCard } from "@/features/task/components/analytic-card.tsx";

interface Props {
    data: ResponseTask
}

export const DataAnalytics = ({ data }: Props) => {
    return (
        <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className="w-full flex flex-row">
                <div className="flex items-center flex-1">
                    <AnalyticCard
                        title="Всего задач"
                        value={data.total_count}
                        variant={data.count_difference > 0 ? "up" : "down"}
                        increaseValue={data.count_difference}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticCard
                        title="Мои задачи"
                        value={data.count_assigned}
                        variant={data.count_assigned_difference > 0 ? "up" : "down"}
                        increaseValue={data.count_assigned_difference}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticCard
                        title="Задачи в работе"
                        value={data.count_incomplete}
                        variant={data.count_incomplete_difference > 0 ? "up" : "down"}
                        increaseValue={data.count_incomplete_difference}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticCard
                        title="Просроченные задачи"
                        value={data.count_overdue}
                        variant={data.count_overdue_difference > 0 ? "up" : "down"}
                        increaseValue={data.count_overdue_difference}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticCard
                        title="Задачи выполненные"
                        value={data.count_complete}
                        variant={data.count_complete_difference > 0 ? "up" : "down"}
                        increaseValue={data.count_complete_difference}
                    />
                </div>
            </div>
        </ScrollArea>
    )
}