'use client';

import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import classes from './NavbarLinksGroup.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            <Link className={classes.link} href={link.link} key={link.link}>
                {link.label}
            </Link>
        )
    });
    return (
        <>
            <UnstyledButton key={link ?? ''} onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }} >
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        {
                            link && (
                                <Box ml="md">
                                    <Text<'p'>
                                        component="p"
                                        key={label}
                                        onClick={(event) => {
                                            router.push(link);
                                            event.preventDefault()
                                        }}
                                    >
                                        {label}
                                    </Text>
                                </Box>
                            )
                        }
                        {
                            !link && (
                                <Box ml="md">{label}</Box>
                            )
                        }
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