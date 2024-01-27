'use client';
import { useState, useEffect } from 'react';
import { Button, Checkbox, Input, Text } from '@mantine/core';

function SettingPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState(false);

    useEffect(() => {
        // Save settings to backend
        saveSettings();
    }, [isDarkMode, username, email, notifications]);

    const saveSettings = () => {
        // Save settings to backend
    };

    return (
        <div>
            <Text>Dark Mode</Text>
            <Checkbox checked={isDarkMode} onChange={(event) => setIsDarkMode(event.currentTarget.checked)} />

            <Text>Username</Text>
            <Input value={username} onChange={(event) => setUsername(event.currentTarget.value)} />

            <Text>Email</Text>
            <Input value={email} onChange={(event) => setEmail(event.currentTarget.value)} />

            <Text>Notifications</Text>
            <Checkbox checked={notifications} onChange={(event) => setNotifications(event.currentTarget.checked)} />

            <Button onClick={saveSettings}>Save</Button>
        </div>
    );
}

export default SettingPage;
