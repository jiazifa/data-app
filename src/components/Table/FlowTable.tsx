
import { useBudgetList } from '@/server/finance';
import { useUserList } from '@/server/user';
import { Flow, FlowInOrOutMapTitle, FlowStatus } from '@/types/models';
import { Badge, Table, Group, Text, ActionIcon, rem } from '@mantine/core';
import { IconFlagCheck, IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';


type FlowTableProps = {
    data: Flow[];
    onEditAction: (flow: Flow) => void;
    onDeleteAction: (flow: Flow) => void;
    onPassAction: (flow: Flow) => void;
};


const status2color = (status: FlowStatus) => {
    switch (status) {
        case FlowStatus.UNCHECKED:
            return "gray";
        case FlowStatus.CHECKED:
            return "green";
        case FlowStatus.ARCHIVER:
            return "green";
    }
}

const status2text = (status: FlowStatus) => {
    switch (status) {
        case FlowStatus.UNCHECKED:
            return "未审核";
        case FlowStatus.CHECKED:
            return "已审核";
        case FlowStatus.ARCHIVER:
            return "已归档";
    }
}


export function FlowTable({ data, onDeleteAction, onEditAction, onPassAction }: FlowTableProps) {
    const { data: budgetList, error: budgetListError } = useBudgetList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    const { data: userList, error: userListError } = useUserList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    if (budgetListError) {
        return <Badge color="red">预算列表加载失败</Badge>;
    }
    const budgetListData = budgetList?.data ?? [];
    //should be memoized or stable
    const rows = data.map((item) => {
        const fen = item.money_fen;
        // format yuan to 2 decimal places
        const yuan = (fen / 100).toFixed(2);
        let budgetTitle = '';
        const budget = budgetListData.find(budget => budget.identifier === item.budget_idf);
        const rootBudget = budgetListData.find(b => b.identifier === budget?.parentIdf);
        if (!rootBudget) {
            budgetTitle = `${budget?.title ?? ''}`
        } else {
            budgetTitle = `${rootBudget?.title ?? ''} / ${budget?.title ?? ''}`
        }

        return (
            <Table.Tr key={item.identifier}>
                <Table.Td>
                    <Badge color={status2color(item.flow_status)}>{status2text(item.flow_status)}</Badge>
                </Table.Td>
                <Table.Td>
                    <Text fz="sm">
                        {item.title}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text fz="sm">
                        {userList?.data.find(user => user.identifier === item.user_idf)?.userName}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text fz="sm">{FlowInOrOutMapTitle[item.in_or_out]}</Text>
                </Table.Td>

                <Table.Td>
                    <Text fz="sm">{yuan} 元</Text>
                </Table.Td>

                <Table.Td>
                    <Text fz="sm">{
                        budgetTitle
                    }</Text>
                </Table.Td>

                <Table.Td>
                    <Text fz="sm">{dayjs(item.spend_at).format("YYYY-MM-DD")}</Text>
                </Table.Td>
                <Table.Td>
                    {item.flow_status !== FlowStatus.ARCHIVER && (
                        <Group gap='lg' justify="flex-end">
                            <ActionIcon variant="subtle" color="green" onClick={() => onPassAction(item)}>
                                <IconFlagCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" onClick={() => onEditAction(item)}>
                                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => onDeleteAction(item)}>
                                <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            </ActionIcon>
                        </Group>
                    )}
                    {item.flow_status === FlowStatus.ARCHIVER && (
                        <Group gap={0} justify="flex-end">
                            <Text fz="sm" mr='sm'>已归档</Text>
                        </Group>
                    )}

                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>状态</Table.Th>
                            <Table.Th>标题</Table.Th>
                            <Table.Th>用户</Table.Th>
                            <Table.Th>收/支 </Table.Th>
                            <Table.Th>金额 </Table.Th>
                            <Table.Th>预算</Table.Th>
                            <Table.Th>时间</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </>
    );
}
