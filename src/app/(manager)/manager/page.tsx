'use client';

import BoardStat, { StatItem } from "@/components/Stat/BoardStat";
import { useBudgetList, useBudgetPieInfo, useFlowList } from "@/server/finance";
import { FlowInOrOut, FlowStatus } from "@/types/models";
import { Button, Card, Group, Progress, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dayjs from "dayjs";
import { useState } from "react";
import { Pie } from 'react-chartjs-2';


export default function Dashboard() {
    return (
        <>
            Dashboard
        </>
    )
    // State
    // date range
    // const today = new Date();
    // const start_of_month = new Date(today.getFullYear() - 1, today.getMonth(), 1, 0, 0, 0, 0);
    // const end_of_month = new Date(today.getFullYear() - 1, today.getMonth() + 1, 0, 23, 59, 59, 999);

    // const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([start_of_month, end_of_month]);

    // const { data: budgetListData } = useBudgetList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });

    // const rootBudget = (budgetListData?.data ?? []).filter((item) => item.parent_idf == "");
    // const root_budget_idfs = rootBudget.map((item) => item.identifier);

    // console.log(`allBudgetNames: ${JSON.stringify(budgetListData)}`)
    // console.log(`rootBudget: ${JSON.stringify(rootBudget)}, root_budget_idfs: ${JSON.stringify(root_budget_idfs)}`)
    // console.log(`rootBudgetName: ${rootBudget.map((item) => item.title)}`)
    // const { data: flowInRange } = useFlowList({ start_at: dayjs(start_of_month).valueOf(), end_at: dayjs(end_of_month).valueOf() }, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    // const all_flows = flowInRange?.data ?? [];

    // // 计算 收入/支出/结余
    // const income = all_flows.filter((item) => item.money_fen > 0 && item.in_or_out == FlowInOrOut.IN).reduce((prev, curr) => prev + curr.money_fen, 0);
    // const outcome = all_flows.filter((item) => item.money_fen > 0 && item.in_or_out == FlowInOrOut.OUT).reduce((prev, curr) => prev + curr.money_fen, 0);
    // const unchecked_flow_num = all_flows.filter((item) => item.flow_status == FlowStatus.UNCHECKED).length;
    // const all_count = all_flows.length;

    // console.log(`flowInRange: ${JSON.stringify(flowInRange)}`)
    // // 加载所有条目

    // const prevMonth = () => {
    //     const start_at = dayjs(dateRange[0]).subtract(1, 'month');
    //     const start_of_month = dayjs(start_at).startOf('month').toDate();
    //     const end_at = dayjs(dateRange[1]).subtract(1, 'month');
    //     const end_of_month = dayjs(end_at).endOf('month').toDate();
    //     setDateRange([start_of_month, end_of_month]);
    // };

    // const nextMonth = () => {
    //     const start_at = dayjs(dateRange[0]).add(1, 'month');
    //     const start_of_month = dayjs(start_at).startOf('month').toDate();
    //     const end_at = dayjs(dateRange[1]).add(1, 'month');
    //     const end_of_month = dayjs(end_at).endOf('month').toDate();
    //     setDateRange([start_of_month, end_of_month]);
    // };

    // const stat_props: StatItem[] = [
    //     {
    //         label: '收入',
    //         value: `${income / 100} 元`,
    //         progress: 100,
    //         color: 'blue',
    //         icon: 'up',
    //     },
    //     {
    //         label: '支出',
    //         value: `${outcome / 100} 元`,
    //         progress: 100,
    //         color: 'red',
    //         icon: 'down',
    //     },
    //     {
    //         label: '未审核/总数',
    //         value: `${unchecked_flow_num}/${all_count}`,
    //         progress: all_count == 0 ? 0 : (all_count - unchecked_flow_num) / all_count * 100,
    //         color: 'green',
    //         icon: 'up',
    //     },
    // ];

    // ChartJS.register(ArcElement, Tooltip, Legend);

    // return (
    //     <>
    //         <Group justify="flex-end">
    //             <Button onClick={prevMonth}>
    //                 &lt;
    //             </Button>
    //             <DatePickerInput
    //                 type="range"
    //                 placeholder="请选择看板时间范围"
    //                 valueFormat="YYYY/MM/DD"
    //                 value={dateRange}
    //                 onChange={setDateRange}
    //             />
    //             <Button onClick={nextMonth}>
    //                 &gt;
    //             </Button>
    //         </Group>

    //         <Card
    //             mt='md'>
    //             <BoardStat
    //                 stats={stat_props}
    //             />
    //         </Card>

    //         <Card mt="md" radius="md" bg="var(--mantine-color-body)">
    //             <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
    //                 上月概览
    //             </Text>
    //             <Text fz="lg" fw={500}>
    //                 $5.431 / $10.000
    //             </Text>
    //             <Progress value={54.31} mt="md" size="lg" radius="xl" />
    //         </Card>
    //         {/* <Container mt='md'>
    //                 <Pie data={pieData} />
    //             </Container> */}
    //     </>
    // );
}