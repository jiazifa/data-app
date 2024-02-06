
import { User } from '@/types';
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

type UserTableProps = {
    data: User[];
    onDeleteUserAction: (user: User) => void;
    onEditUserAction: (user: User) => void;
};

const jobColors: Record<string, string> = {
    engineer: 'blue',
    manager: 'cyan',
    designer: 'pink',
};

export function UsersTable({ data, onDeleteUserAction, onEditUserAction }: UserTableProps) {
    const rows = data.map((item) => (
        <Table.Tr key={item.identifier}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.user_name} radius={30} />
                    <Text fz="sm" fw={500}>
                        {item.user_name}
                    </Text>
                </Group>
            </Table.Td>

            {/* <Table.Td>
                <Badge color={jobColors["engineer".toLowerCase()]} variant="light">
                    {"engineer"}
                </Badge>
            </Table.Td> */}
            <Table.Td>
                <Anchor component="button" size="sm">
                    {item.email}
                </Anchor>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item.phone}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray" onClick={() => onEditUserAction(item)}>
                        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => onDeleteUserAction(item)}>
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
                        <Table.Th>姓名</Table.Th>
                        {/* <Table.Th>Tag</Table.Th> */}
                        <Table.Th>邮箱</Table.Th>
                        <Table.Th>电话</Table.Th>
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
