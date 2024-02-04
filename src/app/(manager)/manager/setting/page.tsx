'use client';
import { useState, useEffect } from 'react';
import { Button, Checkbox, Input, Text } from '@mantine/core';
import { query_user_by_options } from '@/server/user';

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
        const users = await query_user_by_options({});
        console.log(`获取用户列表成功：${JSON.stringify(users)}`)
    };

    return (
        <div>
            <Button onClick={saveSettings}>Save</Button>
        </div>
    );
}

export default SettingPage;
