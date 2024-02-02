'use client';

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

import { Group } from '@mantine/core';
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { UsersTable } from "@/components/Table/UserTable";
import { modals } from '@mantine/modals';
import { CreateUserForm } from "@/components/Form/CreateUserForm";
import { User } from "@/types/models";
import { CreateUserOptions, createUser, query_user_by_options, useUserList } from "@/service/user";

const UserListPage = () => {
    const router = useRouter();
    // const { data, error, mutate: userMutate } = useUserList();
    // if (error) {
    //     console.log(`获取用户列表失败：${error}`)
    // }

    // console.log(`获取用户列表成功：${JSON.stringify(data)}`)

    const onAddUserAction = async (values: CreateUserOptions) => {
        try {
            const user = await createUser({ ...values });
            console.log(`创建用户成功：${JSON.stringify(user)}`)
        } catch (error) {
            console.log(`创建用户失败：${error}`)
        } finally {
            modals.closeAll();
            // userMutate();
        }
    }
    const onCreateUserModalAction = () => {
        modals.open({
            title: '创建用户',
            children: (
                <CreateUserForm
                    onSubmitAction={onAddUserAction}
                />
            ),
        });
    };

    const onDeleteUserAction = (user: User) => {
        modals.openConfirmModal({
            title: '删除用户',
            withCloseButton: true,
            onConfirm: () => {
                console.log(`删除用户：${user.username} 暂时不可用`);
            },
            labels: { confirm: '确定', cancel: '取消' },
        })
    };

    const onEditUserAction = (user: User) => {
        router.push(`/manager/user/${user.identifier}`);
    }

    return (
        <>
            <PageContainer title="用户列表">
                <Group justify="flex-end">
                    <Button onClick={onCreateUserModalAction}>创建用户</Button>
                </Group>
                {/* <UsersTable
                    data={data?.data ?? []}
                    onDeleteUserAction={onDeleteUserAction}
                    onEditUserAction={onEditUserAction}
                /> */}
            </PageContainer>
        </>
    );
}

export default UserListPage;