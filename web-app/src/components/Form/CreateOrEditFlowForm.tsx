'use client';

import { CreateOrUpdateFlowOptions, update_flow, useBudgetList } from "@/service/finance";
import { useUserList } from "@/service/user";
import { FlowStatus, FlowInOrOut, PayType, Flow, FlowInOrOutMapTitle, FlowStatusMapTitle, PayTypeMapTitle } from "@/types/models";
import { Textarea, Button, Container, Group, NumberInput, Select, TextInput, Autocomplete } from "@mantine/core";
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { FC, useState } from "react";

type CreateOrEditFlowPageProps = {
    onSubmitAction: (values: CreateOrUpdateFlowOptions) => void;
    flow?: Flow;
};

const CreateOrEditFlowForm: FC<CreateOrEditFlowPageProps> = ({ onSubmitAction, flow }: CreateOrEditFlowPageProps) => {
    const { data: userList, error: userError } = useUserList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    const { data: budgetList, error: budgetError } = useBudgetList(undefined, { page: 1, page_size: Number.MAX_SAFE_INTEGER });
    if (budgetError) {
        console.log(`获取预算列表失败：${budgetError}`)
    }
    if (userError) {
        console.log(`获取用户列表失败：${userError}`)
    }
    const submit_title = flow ? '更新' : '创建';
    let spend_time = new Date();
    if (flow) {
        spend_time = dayjs(flow.spend_at).toDate();
    }
    const rootBudgets = (budgetList?.data ?? []).filter((value) => (value.parent_idf ?? '') === '');
    let root_budget_idf = '';
    let budget_idf = '';

    if (flow?.budget_idf) {
        const budget = budgetList?.data.find((budget) => budget.identifier === flow?.budget_idf);

        if (budget) {
            if (budget?.parent_idf) {
                budget_idf = budget.identifier;
                root_budget_idf = budget.parent_idf;
            } else {
                root_budget_idf = budget.identifier;
            }
        }
        console.log(`root_budget_idf: ${root_budget_idf}, budget_idf: ${budget_idf} budget: ${JSON.stringify(budget)}`)
    }

    const form = useForm<CreateOrUpdateFlowOptions>({
        initialValues: {
            identifier: flow?.identifier,
            title: flow?.title ?? '测试账单',
            user_idf: flow?.user_idf,
            money_fen: (flow?.money_fen ?? 0) / 100,
            root_budget_idf: root_budget_idf,
            budget_idf: budget_idf,

            in_or_out: flow?.in_or_out ?? FlowInOrOut.UNKONWN,
            flow_status: flow?.flow_status ?? FlowStatus.UNCHECKED,
            pay_type: flow?.pay_type ?? PayType.UNKONWN,
            pay_detail: flow?.pay_detail ?? '',

            counterparty: flow?.counterparty ?? '',
            order_id: flow?.order_id ?? '',

            product_info: flow?.product_info ?? '',
            source_raw: flow?.source_raw ?? '',
            remark: flow?.remark ?? '',
            spend_at: spend_time,
        },
    });

    return (
        <>
            <Container size='xs'>
                <form onSubmit={form.onSubmit((values) => {
                    values.money_fen = values.money_fen * 100;
                    values.money_fen = Math.round(values.money_fen);
                    values.budget_idf = values.budget_idf ?? values.root_budget_idf;
                    onSubmitAction(values)
                })}>
                    <Group grow mt="md">
                        <TextInput
                            label="标题"
                            placeholder="请输入标题"
                            {...form.getInputProps('title')}
                        />

                    </Group>

                    <Group grow mt="md">
                        <NumberInput
                            label={`金额(元)`}
                            thousandSeparator=","
                            placeholder="请输入预算金额"
                            step={100}
                            {...form.getInputProps('money_fen')}
                        />
                        <Select
                            withAsterisk
                            label="用户"
                            placeholder="请选择用户"
                            checkIconPosition="right"
                            data={[
                                ...userList?.data.map((user) => {
                                    return { value: user.identifier, label: `${user.user_name}` }
                                }) ?? [
                                ]
                            ]}
                            {...form.getInputProps('user_idf')}
                        />
                    </Group>

                    <Group grow mt="md">
                        <Select
                            withAsterisk
                            label="一级预算"
                            placeholder="请选择预算"
                            checkIconPosition="right"
                            data={[
                                ...rootBudgets.map((budget) => {
                                    return { value: budget.identifier, label: `${budget.title}` }
                                }) ?? []
                            ]}
                            {...form.getInputProps('root_budget_idf')}
                        />
                        <Select
                            label="二级预算"
                            placeholder="请选择二级预算"
                            checkIconPosition="right"
                            data={[
                                ...(budgetList?.data ?? []).filter((value) => {
                                    const root_budget_idf = form.values.root_budget_idf ?? '';
                                    if (root_budget_idf === '') {
                                        return false;
                                    }
                                    return (value.parent_idf ?? '') === root_budget_idf;
                                }).map((budget) => {
                                    return { value: budget.identifier, label: `${budget.title}` }
                                }) ?? []
                            ]}
                            {...form.getInputProps('budget_idf')}
                        />

                    </Group>
                    <Group grow mt="md">
                        <Select
                            mt="md"
                            label="收支类型"
                            placeholder="请选择收支类型"
                            checkIconPosition="right"
                            data={[
                                { value: FlowInOrOut.OUT, label: FlowInOrOutMapTitle[FlowInOrOut.OUT] },
                                { value: FlowInOrOut.IN, label: FlowInOrOutMapTitle[FlowInOrOut.IN] },
                                { value: FlowInOrOut.IGNORE, label: FlowInOrOutMapTitle[FlowInOrOut.IGNORE] },
                            ]}
                            {...form.getInputProps('in_or_out')}
                        />
                        <Select
                            mt='md'
                            label="账单状态"
                            placeholder="请选择账单状态"
                            checkIconPosition="right"
                            data={[
                                { value: FlowStatus.UNCHECKED, label: FlowStatusMapTitle[FlowStatus.UNCHECKED] },
                                { value: FlowStatus.CHECKED, label: FlowStatusMapTitle[FlowStatus.CHECKED] },
                                { value: FlowStatus.ARCHIVER, label: FlowStatusMapTitle[FlowStatus.ARCHIVER] },
                            ]}
                            {...form.getInputProps('flow_status')}
                        />
                    </Group>
                    <Group grow mt="md">
                        <Select
                            mt='md'
                            label="支付类型"
                            placeholder="请选择支付类型"
                            checkIconPosition="right"
                            data={[
                                { value: PayType.CASH, label: PayTypeMapTitle[PayType.CASH] },
                                { value: PayType.ALIPAY, label: PayTypeMapTitle[PayType.ALIPAY] },
                                { value: PayType.WECHAT, label: PayTypeMapTitle[PayType.WECHAT] },
                                { value: PayType.BANKCARD, label: PayTypeMapTitle[PayType.BANKCARD] },
                                { value: PayType.CREDITCARD, label: PayTypeMapTitle[PayType.CREDITCARD] },
                            ]}
                            {...form.getInputProps('pay_type')}
                        />
                        <TextInput
                            mt='md'
                            label="支付详情(银行卡/支付宝/微信)"
                            placeholder="请输入支付详情"
                            {...form.getInputProps('pay_detail')}
                        />
                    </Group>

                    <Group grow mt="md">
                        <TextInput
                            mt='md'
                            label="交易对方"
                            placeholder="请输入交易对方"
                            {...form.getInputProps('counterparty')}
                        />

                        <TextInput
                            mt='md'
                            label="商品详情"
                            placeholder="请输入商品详情"
                            {...form.getInputProps('product_detail')}
                        />

                    </Group>

                    <Group grow mt="md">
                        <DateTimePicker
                            mt='md'
                            valueFormat="YYYY/MM/DD HH:mm:ss"
                            label="消费时间"
                            placeholder="选择消费时间"
                            {...form.getInputProps('spend_at')}
                        />

                        <TextInput
                            mt='md'
                            label="订单号"
                            placeholder="请输入订单号"
                            {...form.getInputProps('order_id')}
                        />
                    </Group>
                    <TextInput
                        mt='md'
                        label="备注"
                        placeholder="请输入备注"
                        {...form.getInputProps('remark')}
                    />

                    <Textarea
                        label="原始数据"
                        placeholder="请输入原始数据"
                        autosize
                        minRows={6}
                        {...form.getInputProps('source_raw')}
                    />

                    <Group justify="flex-end" mt="md">
                        {flow?.flow_status === FlowStatus.UNCHECKED && <Button type="button" onClick={() => {
                            onSubmitAction({ ...flow, flow_status: FlowStatus.CHECKED });
                        }}>审核通过</Button>}
                        <Button type="submit">{submit_title}</Button>
                    </Group>
                </form>
            </Container>
        </>
    )
};
export { CreateOrEditFlowForm }
export type { CreateOrEditFlowPageProps }