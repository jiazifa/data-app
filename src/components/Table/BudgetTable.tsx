
import { useBudgetList } from '@/server/finance';
import { useUserList } from '@/server/user';
import { Budget } from '@/types/models';
import { Badge, Table, Group, Text, ActionIcon, rem } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';


type BudgetTableProps = {
    budgets: Budget[];
    onEditBudgetAction: (budget: Budget) => void;
    onDeleteBudgetAction: (budget: Budget) => void;
};

export function BudgetTable({ budgets, onEditBudgetAction, onDeleteBudgetAction }: BudgetTableProps) {
    const { data: allBudget } = useBudgetList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    let budgetMap = new Map<string, string>();
    if (allBudget) {
        allBudget.data.forEach((item) => {
            budgetMap.set(item.identifier, item.title ?? "未知用户");
        });
    }
    const rows = budgets.map((item) => (
        <Table.Tr key={item.identifier}>
            <Table.Td>
                <Text fz="sm" fw={500}>
                    {item.title}
                </Text>
            </Table.Td>

            <Table.Td>
                <Text fz="sm">{budgetMap.get(item.parentIdf ?? "") ?? "无"}</Text>
            </Table.Td>

            <Table.Td>
                <Text fz="sm">{item.remark ?? "暂无"}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray" onClick={() => onEditBudgetAction(item)}>
                        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => onDeleteBudgetAction(item)}>
                        <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>预算标题</Table.Th>
                        <Table.Th>父节点</Table.Th>
                        <Table.Th>备注</Table.Th>
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
