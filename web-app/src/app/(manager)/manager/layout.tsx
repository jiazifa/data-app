'use client';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const [navBarOpened, setNavbarOpened] = useState(true);
    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 200, md: 300, lg: 400 },
                breakpoint: 'sm',
                collapsed: { mobile: !opened, desktop: !navBarOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Burger opened={navBarOpened} onClick={() => setNavbarOpened(!navBarOpened)} visibleFrom="sm" size="sm" />
                    <Title order={2}>数据管理</Title>
                    {/* <MantineLogo size={30} /> */}
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}