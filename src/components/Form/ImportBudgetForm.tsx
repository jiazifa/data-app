'use client';

import { createBudget, getCSVContent, parseCSV, useBudgetList } from "@/server/finance";
import { FlowStatus, FlowInOrOut, PayType, User, Budget } from "@/types";
import { Box, Button, Container, Group, Stepper, Text, rem } from "@mantine/core";
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { FC, useState, useRef } from "react";

type ImportBudgetPageProps = {
    onCompleted?: () => void;
};

enum Step {
    SELECT_FILE,
    COMPLETED,
}

const NextTitleForStep = (step: Step): string => {
    switch (step) {
        case Step.SELECT_FILE:
            return "下一步";
        case Step.COMPLETED:
            return "关闭";
        default:
            return "未知";
    }
}

const ImportBudgetForm: FC<ImportBudgetPageProps> = ({ onCompleted }: ImportBudgetPageProps) => {
    const [active, setActive] = useState<Step>(0);

    const { data: budgetList, error: budgetError } = useBudgetList(undefined, { page: 1, pageSize: Number.MAX_SAFE_INTEGER });

    const openRef = useRef<() => void>(null);

    const nextStep = () => setActive((current) => (current < Step.COMPLETED ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > Step.SELECT_FILE ? current - 1 : current));

    if (budgetError) {
        console.log(`获取预算列表失败：${budgetError}`)
    }

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>

                <Stepper.Step label="选择文件" description="选择账单文件">
                    <Dropzone
                        accept={{
                            'text/csv': [], // All images
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                            'application/vnd.ms-excel': [],
                        }}
                        openRef={openRef}
                        onDrop={(files) => {
                            for (const file of files) {
                                const reader = new FileReader();
                                let pay = PayType.UNKONWN;
                                if (file.name.includes("alipay") || file.name.includes("支付宝")) {
                                    pay = PayType.ALIPAY;
                                } else if (file.name.includes("wechat") || file.name.includes("微信")) {
                                    pay = PayType.WECHAT;
                                }
                                reader.onload = async (event) => {
                                    const data = event.target?.result;
                                    const csvContent = getCSVContent(data as string);
                                    // load csv content to dictionary
                                    const flowDatas = parseCSV(csvContent, pay);
                                    // get budgets from flowDatas
                                    let insertedBudgets: Budget[] = [];
                                    if (pay === PayType.ALIPAY) {
                                        const budgets = flowDatas.map((item) => {
                                            return {
                                                title: item["交易分类"],
                                                remark: `支付宝账单导入`,
                                            }
                                        });
                                        for (const budget of budgets) {
                                            if (budgetList?.data.find((item) => item.title === budget.title)) {
                                                continue;
                                            }
                                            if (insertedBudgets.find((item) => item.title === budget.title)) {
                                                continue;
                                            }
                                            try {
                                                const b = await createBudget(budget);
                                                insertedBudgets.push(b);
                                            } catch (error) {
                                                console.log(`创建预算失败：${error}`);
                                            }
                                        }
                                    }
                                    nextStep();
                                }
                                reader.readAsText(file, 'utf-8');
                            }
                        }}
                    >
                        <Box style={{ pointerEvents: 'none' }}>
                            <Group justify="center">
                                <Dropzone.Accept>
                                    <IconDownload
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={'var(--mantine-color-red-6)'}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={'var(--mantine-color-red-6)'}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                                </Dropzone.Idle>
                            </Group>

                            <Text ta="center" fw={700} fz="lg" mt="xl">
                                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                                <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                                <Dropzone.Idle>上传账单文件</Dropzone.Idle>
                            </Text>
                            <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                拖拽文件到这里或者点击上传
                            </Text>
                        </Box>
                    </Dropzone>
                </Stepper.Step>

                <Stepper.Completed>
                    恭喜你导入成功了预算！
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                {active !== Step.COMPLETED && (
                    <Button variant="default" onClick={prevStep}>返回</Button>
                )}
                <Button onClick={() => {
                    if (active === Step.COMPLETED) {
                        if (onCompleted) {
                            onCompleted();
                        }
                    } else {
                        nextStep();
                    }
                }}>{NextTitleForStep(active)}</Button>
            </Group>
        </>
    )
};
export { ImportBudgetForm }
export type { ImportBudgetPageProps }