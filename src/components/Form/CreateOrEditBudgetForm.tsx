

import { CreateOrUpdateBudgetOptions, useBudgetList } from "@/server/finance";
import { Budget } from "@/types/models";
import { Button, Container, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";

type CreateOrEditBudgetPageProps = {
    budget?: Budget;
    onSubmitAction: (values: CreateOrUpdateBudgetOptions) => void;
};

const CreateOrEditBudgetForm: FC<CreateOrEditBudgetPageProps> = ({ budget, onSubmitAction }: CreateOrEditBudgetPageProps) => {
    const { data: budgetData } = useBudgetList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    const form = useForm<CreateOrUpdateBudgetOptions>({
        initialValues: {
            identifier: budget?.identifier,
            parent_idf: budget?.parentIdf ?? '',
            title: budget?.title ?? '',
            remark: budget?.remark ?? '',
        },
    });

    const budgetOptions = (budgetData?.data ?? []).map((item) => {
        return {
            value: item.identifier,
            label: item.title,
        };
    });
    const confirmTitle = budget ? '更新' : '创建';
    return (
        <>
            <Container size='xs'>
                <form onSubmit={form.onSubmit((values) => {
                    if (values.remark === '') {
                        values.remark = `${budgetData?.data.find((item) => item.identifier === values.parent_idf)?.title ?? ''}-${values.title ?? ''}`
                    }
                    console.log(`values: ${JSON.stringify(values)}`)
                    onSubmitAction(values)
                })}>
                    <Group grow mt='md'>
                        <TextInput
                            label="标题"
                            placeholder="请输入标题"
                            {...form.getInputProps('title')}
                        />

                        <Select
                            label="父级分类(可选)"
                            placeholder="请输入父级分类"
                            checkIconPosition="right"
                            data={budgetOptions}
                            {...form.getInputProps('parent_idf')}
                        />
                    </Group>

                    <TextInput
                        mt="md"
                        label="备注"
                        placeholder="请输入备注"
                        {...form.getInputProps('remark')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">{confirmTitle}</Button>
                    </Group>
                </form>
            </Container>
        </>
    )
};
export { CreateOrEditBudgetForm }
export type { CreateOrEditBudgetPageProps }