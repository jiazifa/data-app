'use client';

import { Box } from '@mantine/core';
import { ReactNode } from 'react';

interface LandingContainerProps {
    children: ReactNode;
}

export function LandingContainer({ children }: LandingContainerProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {children}
        </Box>
    );
}
