
import { Center, Group, Paper, RingProgress, SimpleGrid, Text, rem } from '@mantine/core';
import React, { ReactNode } from 'react';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const icons = {
    up: IconArrowUpRight,
    down: IconArrowDownRight,
};

export interface StatItem {
    // Define the props for your component here
    label: string;
    value?: string;
    color: string;
    progress: number;
    icon: 'up' | 'down';
}

export interface BoardStatProps {
    // Define the props for your component here
    stats: StatItem[];
}

const buildStatView = (stat: StatItem): ReactNode => {
    const Icon = icons[stat.icon];
    return (
        <Paper
            withBorder
            radius="md"
            key={stat.label}
        >
            <Group>
                <RingProgress
                    key={stat.label}
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: stat.progress, color: stat.color }]}
                    label={
                        <Center>
                            <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                        </Center>
                    }
                />

                <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        {stat.label}
                    </Text>
                    <Text fw={700} size="xl">
                        {stat.value}
                    </Text>
                </div>
            </Group>
        </Paper>
    );
}

const BoardStat: React.FC<BoardStatProps> = ({ stats }) => {
    // Implement your component logic here
    const data = stats.map((stat) => {
        return buildStatView(stat);
    });
    return (
        <>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>{data}</SimpleGrid>
        </>
    );
};

export default BoardStat;
