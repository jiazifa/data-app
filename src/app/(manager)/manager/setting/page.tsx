'use client';
import { useState, useEffect } from 'react';
import { Button, Checkbox, Input, Text } from '@mantine/core';
import { query_user_by_options } from '@/server/user';
import { POSTFetcher } from '@/server/global/api';

function SettingPage() {
    // const [isDarkMode, setIsDarkMode] = useState(false);
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [notifications, setNotifications] = useState(false);

    // useEffect(() => {
    //     // Save settings to backend
    //     saveSettings();
    // }, [isDarkMode, username, email, notifications]);

    const saveSettings = async () => {
        console.log('Saving settings...');
        const option = { page: { page: 1, pageSize: 1000 } }
        const users = await query_user_by_options(option);
        console.log(`获取用户列表成功：${JSON.stringify(users)}`)
    };

    const saveTests = async () => {
        console.log('Saving tests...');
        const resp = await POSTFetcher("/api/health");
        console.log(`获取用户列表成功：${JSON.stringify(resp)}`);
    };

    return (
        <div>
            <Button onClick={saveSettings}>Save</Button>
            <Button onClick={saveTests}>Test</Button>
        </div>
    );
}

export default SettingPage;
