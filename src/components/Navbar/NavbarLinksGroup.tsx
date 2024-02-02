'use client';

import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem, NavLink } from '@mantine/core';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import classes from './NavbarLinksGroup.module.css';
import { useRouter } from 'next/navigation';

interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    initiallyOpened?: boolean;
    link?: string;
    links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }: LinksGroupProps) {
    const [opened, setOpened] = useState(initiallyOpened || false);
    const hasLinks = Array.isArray(links);
    const router = useRouter();
    const items = (hasLinks ? links : []).map((link) => {
        return (
            <Text<'a'>
                component="a"
                className={classes.link}
                href={link.link}
                key={link.label}
            >
                {link.label}
            </Text>
        )
    });
    let content = (
        <Box ml="md">{label}</Box>
    );
    if (link) {
        content = (
            <Box ml="md">
                <Text<'a'>
                    component="a"
                    href={link}
                    key={label}
                    onClick={(event) => {
                        router.push(link);
                        event.preventDefault()
                    }}
                >
                    {label}
                </Text>
            </Box>
        );
    }
    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }} >
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        {content}
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(-90deg)' : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}

const mockdata = {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
    ],
};

export function NavbarLinksGroup() {
    return (
        <Box mih={220} p="md">
            <LinksGroup {...mockdata} />
        </Box>
    );
}