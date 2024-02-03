
import { CreateUserOptions } from "@/server/user";
import { Gender } from "@/types/models";
import { Button, Container, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";

type CreateUserPageProps = {
    onSubmitAction: (values: CreateUserOptions) => void;
};

const CreateUserForm: FC<CreateUserPageProps> = ({ onSubmitAction }: CreateUserPageProps) => {
    const form = useForm<CreateUserOptions>({
        initialValues: {
            name: '你好我是谁',
            gender: Gender.MALE,
            email: '',
            phone: '',
        },
    });

    return (
        <>
            <Container size='xs'>
                <form onSubmit={form.onSubmit((values) => onSubmitAction(values))}>
                    <TextInput
                        mt="md"
                        label="用户名"
                        placeholder="请输入用户名"
                        {...form.getInputProps('name')}
                    />
                    <Select
                        mt="md"
                        label="性别"
                        placeholder="请选择性别"
                        checkIconPosition="right"
                        data={[
                            { value: `${Gender.FEMALE}`, label: '女' },
                            { value: `${Gender.MALE}`, label: '男' }
                        ]}
                        {...form.getInputProps('gender')}
                    />
                    <TextInput
                        mt="md"
                        label="邮箱"
                        placeholder="your@email.com"
                        {...form.getInputProps('email')}
                    />
                    <TextInput
                        mt="md"
                        label="手机"
                        placeholder="请输入手机号"
                        {...form.getInputProps('phone')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">创建</Button>
                    </Group>
                </form>
            </Container>
        </>
    )
};
export { CreateUserForm }
export type { CreateUserPageProps }