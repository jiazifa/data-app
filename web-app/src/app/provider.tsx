'use client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';


export function AppProvider({ children }: { children: React.ReactNode }) {

    const theme = createTheme({
        fontFamily: 'sans-serif',
        primaryColor: 'blue',
    });
    const colorSchemeManager = localStorageColorSchemeManager({ key: 'my-app-color-scheme' });

    return (
        // <ColorSchemeScript defaultColorScheme='auto'>
        <MantineProvider
            theme={theme}
            colorSchemeManager={colorSchemeManager}
            defaultColorScheme='auto'
        >
            <ModalsProvider>
                {children}
            </ModalsProvider>
            <Notifications />
            <VercelAnalytics />
        </MantineProvider>
        // </ColorSchemeScript>
    );
}
