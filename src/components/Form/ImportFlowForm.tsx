'use client';

import { createBudget, createFlow, getCSVContent, parseCSV, parseCSV2FlowOption, useBudgetList } from "@/server/finance";
import { useUserList } from "@/server/user";
import { FlowStatus, FlowInOrOut, PayType, User, Budget, CreateOrUpdateFlowReq } from "@/types";
import { Autocomplete, Box, Button, Container, Group, Progress, Stepper, Text, rem } from "@mantine/core";
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { FC, useState, useRef } from "react";

type ImportFlowPageProps = {
    onCompleted?: () => void;
};

enum Step {
    SELECT_USER,
    SELECT_FILE,
    UPLOAD_FILE,
    COMPLETED,
}

const NextTitleForStep = (step: Step): string => {
    switch (step) {
        case Step.SELECT_USER:
            return "下一步";
        case Step.SELECT_FILE:
            return "下一步";
        case Step.UPLOAD_FILE:
            return "完成";
        case Step.COMPLETED:
            return "关闭";
        default:
            return "未知";
    }
}
const ImportFlowForm: FC<ImportFlowPageProps> = ({ onCompleted }: ImportFlowPageProps) => {
    const [active, setActive] = useState<Step>(0);

    const { data: userList, error: userError } = useUserList({ page: { page: 1, pageSize: 100000 } });
    const { data: budgetList, error: budgetError } = useBudgetList({ page: { page: 1, pageSize: 100000 } });

    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [flows, setFlows] = useState<CreateOrUpdateFlowReq[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [errorFlows, setErrorFlows] = useState<string[]>([]);

    const openRef = useRef<() => void>(null);

    const nextStep = () => setActive((current) => (current < Step.COMPLETED ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > Step.SELECT_USER ? current - 1 : current));

    if (userError) {
        console.log(`获取用户列表失败：${userError}`)
    }
    if (budgetError) {
        console.log(`获取预算列表失败：${budgetError}`)
    }

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step label="选择用户" description="选择导入谁的账单">
                    <Container size='xs'>
                        <Autocomplete
                            withAsterisk
                            label="选择用户"
                            placeholder="请选择用户"
                            data={(userList?.data ?? []).map((item) => ({ value: item.identifier, label: item.userName ?? "未知用户" }))}
                            onChange={(value) => {
                                const target_user = userList?.data.find((item) => item.userName === value);
                                console.log(`value: ${value} selected user: ${JSON.stringify(target_user)}`);
                                setSelectedUser(target_user);
                                nextStep();
                            }}
                        />
                    </Container>
                </Stepper.Step>
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
                                reader.onload = (event) => {
                                    const data = event.target?.result;
                                    const csvContent = getCSVContent(data as string);
                                    // load csv content to dictionary
                                    const flowDatas = parseCSV(csvContent, pay);
                                    const bgs = budgetList?.data ?? [];
                                    const flows = parseCSV2FlowOption(flowDatas, pay, selectedUser?.identifier ?? "", bgs);
                                    for (const flow of flows) {
                                        flow.user_idf = selectedUser?.identifier;
                                        // console.log(`flow: ${JSON.stringify(flow)}`);
                                    }
                                    setFlows(flows);
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
                <Stepper.Step label="提交账单" description="提交账单信息">
                    <Progress
                        striped
                        animated
                        value={((completedCount + errorFlows.length) / flows.length) * 100}
                        size="xl"
                        color="blue"
                        radius="xl"
                        style={{ width: "100%" }}
                    />

                    <Group mt="md" justify="center">
                        <Text>
                            共有 {flows.length} 条账单，已导入 {completedCount} 条，失败 {errorFlows.length} 条
                        </Text>
                    </Group>
                    <Group mt="md" justify="center">
                        <Button onClick={() => {
                            const upload = async () => {

                                for (const flow of flows) {
                                    try {
                                        await createFlow(flow);
                                        setCompletedCount((count) => count + 1);
                                    } catch (error) {
                                        console.log(`${flow.title} 导入账单失败：${error}`);
                                        setErrorFlows((flows) => [...flows, flow.title]);
                                    }
                                }
                                nextStep();
                            };
                            upload().then(() => {
                                console.log(`导入成功：${completedCount}，失败：${errorFlows.length}`);
                            }).finally(() => {
                                // nextStep();
                            });

                        }}>
                            开始导入
                        </Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Completed>
                    恭喜你导入成功了{completedCount} 个账单！
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
export { ImportFlowForm }
export type { ImportFlowPageProps }