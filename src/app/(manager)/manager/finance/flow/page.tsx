'use client';

import { CreateOrEditFlowForm } from "@/components/Form/CreateOrEditFlowForm";
import { ImportFlowForm } from "@/components/Form/ImportFlowForm";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { FlowTable } from "@/components/Table/FlowTable";
import { CreateOrUpdateFlowOptions, QueryFlowPayload, createFlow, update_flow, useFlowList } from "@/server/finance";
import { FlowStatus, FlowStatusMapTitle } from "@/types/models";
import { Button, Group, JsonInput, MultiSelect, Pagination } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

const FlowListPage = () => {
    const [activePage, setPage] = useState(1);
    const [flowOptions, setFlowOptions] = useState<QueryFlowPayload>({});
    const { data: flowList, error: flowError, mutate: flowMutate } = useFlowList(flowOptions, { page: activePage, page_size: 20 });
    if (flowError) {
        console.log(`获得账单列表失败: ${flowError}`);
    }
    console.log(`获得账单列表: ${flowList}`);
    if (flowList) {
        console.log(`获得账单列表成功: ${flowList}`);
    }
    const onAddFlowAction = async (values: CreateOrUpdateFlowOptions) => {
        try {
            if (values.identifier) {
                const flow = await update_flow({ ...values });
                console.log(`更新账单成功：${JSON.stringify(flow)}`)
            } else {
                const flow = await createFlow({ ...values });
                console.log(`创建账单成功：${flow}`)
            }
        } catch (error) {
            console.log(`创建账单失败：${error}`)
        } finally {
            modals.closeAll();
            flowMutate();

        }
    }

    const onCreateFlowModalAction = () => {
        modals.open({
            title: '添加账单',
            size: 'xl',
            children: (
                <CreateOrEditFlowForm
                    onSubmitAction={onAddFlowAction}
                />
            ),
        });
    };
    const flowStatusOptions = Object.keys(FlowStatus).map((key) => {
        const value = FlowStatus[key as keyof typeof FlowStatus];
        return {
            value,
            label: FlowStatusMapTitle[value],
        };
    });
    return (
        <>
            <PageContainer title="账单管理">
                <Group justify="flex-end">
                    <MultiSelect
                        checkIconPosition="right"
                        hidePickedOptions
                        placeholder="选择筛选条件"
                        data={[
                            {
                                group: '审核状态', items:
                                    flowStatusOptions,
                            },
                        ]}
                        onChange={(values) => {
                            let options: QueryFlowPayload = {};
                            values.forEach((value) => {
                                if (value === FlowStatus.UNCHECKED) {
                                    options.flow_status = FlowStatus.UNCHECKED;
                                }
                            });
                            setFlowOptions(options);
                        }}
                        searchable
                    />
                    <Button onClick={
                        () => {
                            modals.open({
                                title: '导入账单',
                                size: 'xl',
                                children: (
                                    <ImportFlowForm
                                        onCompleted={() => {
                                            modals.closeAll();
                                            flowMutate();
                                        }}
                                    />
                                ),
                            });
                        }
                    }>导入</Button>
                    <Button onClick={onCreateFlowModalAction}>新建账单</Button>
                </Group>
                <FlowTable
                    data={flowList?.data ?? []}
                    onDeleteAction={(flow) => {
                        console.log(`删除账单：${flow}`)
                    }}

                    onEditAction={(flow) => {
                        modals.open({
                            title: '编辑账单',
                            size: 'xl',
                            children: (
                                <CreateOrEditFlowForm
                                    onSubmitAction={onAddFlowAction}
                                    flow={flow}
                                />
                            ),
                        });
                    }}

                    onPassAction={(flow) => {
                        if (flow.flow_status !== FlowStatus.UNCHECKED) {
                            return;
                        }
                        if (flow.budget_idf === undefined) {
                            return;
                        }
                        flow.flow_status = FlowStatus.CHECKED;
                        onAddFlowAction({ ...flow })
                    }}
                />
                <Group justify="flex-end">
                    <Pagination
                        style={{ marginTop: '1rem' }}
                        size="md"
                        variant="outline"
                        withControls
                        value={activePage}
                        onChange={setPage}
                        total={flowList?.total_page ?? 10}
                    />
                </Group>
            </PageContainer>
        </>
    );
};

export default FlowListPage;