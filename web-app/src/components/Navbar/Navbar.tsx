import { Group, Code, ScrollArea, rem } from '@mantine/core';
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from '@tabler/icons-react';
import { LinksGroup } from './NavbarLinksGroup';
// import { Logo } from './Logo';
import classes from './Navbar.module.css';

const mockdata = [
    { label: '看板', icon: IconGauge, link: "/manager/" },
    {
        label: '用户管理',
        icon: IconNotes,
        link: "/manager/user",
    },
    {
        label: '账单管理',
        icon: IconCalendarStats,
        links: [
            { label: '预算管理', link: '/manager/finance/budget' },
            { label: '账单列表', link: '/manager/finance/flow' },
        ],
    },
    {
        label: '设置',
        icon: IconAdjustments,
        link: "/manager/setting",
    }
];

export function Navbar() {
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="space-between">
                    {/* <Logo style={{ width: rem(120) }} /> */}
                    <Code fw={700}>v3.1.2</Code>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
            </div>
        </nav>
    );
}