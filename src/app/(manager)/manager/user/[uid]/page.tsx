'use client';

import { PageContainer } from '@/components/PageContainer/PageContainer';
import { getUserByIdentifier, getUserByOptions } from '@/service/user';
import { Gender, User } from '@/types/models';
import { Avatar, Button, Container, Group, Paper, Select, Text, TextInput } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDetailPage() {
    const params = useParams();
    const uid: string = params.uid as string;

    const [user, setUser] = useState<User | undefined>();
    useEffect(() => {
        console.log(`params.uid: ${params.uid}`);
        getUserByIdentifier(uid).then((user) => {
            setUser(user);
        });
    }, [params.uid, uid]);

    return (
        <>
            <PageContainer title='用户详情'>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                    <Avatar
                        src={user?.username}
                        size={120}
                        radius={120}
                        mx="auto"
                    />
                    <Text ta="center" fz="lg" fw={500} mt="md">
                        {user?.username}
                    </Text>
                    <Text ta="center" c="dimmed" fz="sm">
                        {user?.email ?? "暂无邮箱"} • {user?.phone ?? "暂无手机号"}
                    </Text>
                </Paper>
            </PageContainer>
        </>
    )
};