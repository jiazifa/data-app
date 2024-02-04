'use client';

import { CreateOrEditBudgetForm } from "@/components/Form/CreateOrEditBudgetForm";
import { ImportBudgetForm } from "@/components/Form/ImportBudgetForm";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { BudgetTable } from "@/components/Table/BudgetTable";
import { CreateOrUpdateBudgetOptions as CreateOrEditBudgetOptions, createBudget, delete_budget, update_budget, useBudgetList } from "@/server/finance";
import { Button, Group, Pagination } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";


const BudgetListPage = () => {
    const [activePage, setPage] = useState(1);
    const { data: budgetList, error, mutate: budgetMutate } = useBudgetList(undefined, { page: activePage, page_size: 20 });
    if (error) {
        console.log(`获取预算列表失败：${error}`)
    }

    const onAddBudgetAction = async (values: CreateOrEditBudgetOptions) => {
        try {
            if (values.identifier) {
                const budget = await update_budget({ ...values });
                console.log(`更新预算成功：${JSON.stringify(budget)}`)
            } else {
                const budget = await createBudget({ ...values });
                console.log(`创建预算成功：${JSON.stringify(budget)}`)
            }
        } catch (error) {
            console.log(`创建用户失败：${error}`)
        } finally {
            modals.closeAll();
            budgetMutate();
        }
    }

    const onCreateBudgetModalAction = () => {
        modals.open({
            title: '创建预算',
            size: 'xl',
            children: (
                <CreateOrEditBudgetForm
                    onSubmitAction={onAddBudgetAction}
                />
            ),
        });
    };

    return (
        <>
            <PageContainer title="预算管理">
                <Group justify="flex-end">
                    <Button onClick={() => {
                        modals.open({
                            title: '导入预算',
                            size: 'xl',
                            children: (
                                <ImportBudgetForm
                                    onCompleted={() => {
                                        modals.closeAll();
                                        budgetMutate();
                                    }}
                                />
                            ),
                        });
                    }}>导入预算</Button>
                    <Button onClick={onCreateBudgetModalAction}>新建预算</Button>
                </Group>
                <BudgetTable
                    budgets={budgetList?.data ?? []}
                    onDeleteBudgetAction={(budget) => {
                        modals.openConfirmModal({
                            title: '删除预算',
                            children: `确定删除预算：${budget.title} 吗？`,
                            labels: { confirm: '确认', cancel: '取消' },
                            onCancel: () => { },
                            onConfirm: async () => {
                                console.log(`删除预算：${JSON.stringify(budget)}`);
                                try {
                                    await delete_budget([budget.identifier]);
                                    console.log(`删除预算成功：${JSON.stringify(budget)}`)
                                } catch (error) {
                                    console.log(`删除预算失败：${error}`)
                                } finally {
                                    budgetMutate();
                                }
                            },

                        })
                    }}
                    onEditBudgetAction={(budget) => {
                        modals.open({
                            title: '编辑预算',
                            size: 'xl',
                            children: (
                                <CreateOrEditBudgetForm
                                    budget={budget}
                                    onSubmitAction={onAddBudgetAction}
                                />
                            ),
                        })
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
                        total={budgetList?.total_page ?? 10}
                    />
                </Group>
            </PageContainer>
        </>
    );
};

export default BudgetListPage;