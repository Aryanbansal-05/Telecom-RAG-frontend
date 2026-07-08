/**
 * Chinese → English translation lookup for the Zenodo 5G fault dataset.
 * Column *headers* are already translated in the backend (ALARM_COLUMNS, etc.).
 * This file handles *cell values* that remain in Chinese.
 */

// ── Alarm titles ──────────────────────────────────────────────────────────────
export const ALARM_TITLE_MAP: Record<string, string> = {
  "PFCP对端节点不可达":                        "PFCP Remote Node Unreachable",
  "PFCP链路故障":                              "PFCP Link Failure",
  "平均PDU会话数波动大于历史同期30%":           "Avg PDU Session Count Deviation >30% vs Historical",
  "[频次告警]PCF与NF之间的HTTP链路故障":        "[Frequent] PCF–NF HTTP Link Failure",
  "PCF与NF之间的HTTP链路故障":                  "PCF–NF HTTP Link Failure",
  "PCF和NF通信故障":                            "PCF–NF Communication Failure",
  "[频次告警]用户通知链路故障":                 "[Frequent] User Notification Link Failure",
  "用户通知链路故障":                           "User Notification Link Failure",
  "批量NG-RAN链路故障":                         "Bulk NG-RAN Link Failure",
  "NFInstanceID冲突":                           "NF Instance ID Conflict",
  "初始注册平均时长波动大于历史同期30%":        "Initial Registration Avg Duration Deviation >30% vs Historical",
};

// ── Alarm severity levels ─────────────────────────────────────────────────────
export const ALARM_LEVEL_MAP: Record<string, string> = {
  "二级告警": "Major (L2)",
  "三级告警": "Minor (L3)",
  "一级告警": "Critical (L1)",
  "四级告警": "Warning (L4)",
};

// ── City / operator names ─────────────────────────────────────────────────────
export const CITY_MAP: Record<string, string> = {
  "省公司": "Provincial Operator",
};

// ── Vendor names ──────────────────────────────────────────────────────────────
export const VENDOR_MAP: Record<string, string> = {
  "华为": "Huawei",
  "中兴": "ZTE",
  "爱立信": "Ericsson",
  "诺基亚": "Nokia",
};

// ── Device / NE type codes ────────────────────────────────────────────────────
export const DEVICE_TYPE_MAP: Record<string, string> = {
  "3101": "UDM",
  "3102": "SMF",
  "3103": "UPF",
  "3104": "AMF",
  "3105": "PCF",
  "3106": "AUSF",
  "3107": "NRF",
};

// ── Site / pool names ─────────────────────────────────────────────────────────
export const SITE_MAP: Record<string, string> = {
  "可信1资源池": "Trusted Pool 1",
  "可信2资源池": "Trusted Pool 2",
  "可信3资源池": "Trusted Pool 3",
  "可信4资源池": "Trusted Pool 4",
  "可信5资源池": "Trusted Pool 5",
  "可信6资源池": "Trusted Pool 6",
  "可信7资源池": "Trusted Pool 7",
};

// ── Performance metric names ──────────────────────────────────────────────────
export const METRIC_NAME_MAP: Record<string, string> = {
  // PDU Session
  "PDU会话建立成功次数":            "PDU Session Setup Success Count",
  "PDU会话建立流程平均时长":         "PDU Session Setup Avg Duration (ms)",
  "PDU会话建立请求次数":             "PDU Session Setup Request Count",
  "PDU会话建立失败次数":             "PDU Session Setup Failure Count",
  "平均PDU会话数":                   "Avg PDU Session Count",
  "最大PDU 会话数":                  "Max PDU Session Count",
  "最大PDU会话数":                   "Max PDU Session Count",
  "会话建立成功率":                  "Session Setup Success Rate (%)",
  "会话更新成功率":                  "Session Update Success Rate (%)",
  "SA 会话建立成功率":               "SA Session Setup Success Rate (%)",
  // QFI / Capacity
  "QFI容量峰值利用率":               "QFI Capacity Peak Utilization (%)",
  "QFI容量平均利用率":               "QFI Capacity Avg Utilization (%)",
  "会话容量峰值利用率":              "Session Capacity Peak Utilization (%)",
  "会话容量平均利用率":              "Session Capacity Avg Utilization (%)",
  "地址池峰值利用率":                "Address Pool Peak Utilization (%)",
  "地址池平均利用率":                "Address Pool Avg Utilization (%)",
  "最大QFI数":                       "Max QFI Count",
  "最大Qos流数":                     "Max QoS Flow Count",
  "平均Qos流数":                     "Avg QoS Flow Count",
  // AMF
  "AMF空闲态用户数":                 "AMF Idle-Mode UE Count",
  "AMF连接态用户数":                 "AMF Connected-Mode UE Count",
  "AMF注册态用户数":                 "AMF Registered UE Count",
  "AMF注册容量利用率":               "AMF Registration Capacity Utilization (%)",
  "最大注册用户数":                  "Max Registered UE Count",
  "AMF挂接5G基站数":                 "AMF Attached 5G gNB Count",
  // Handover
  "AMF间切换出尝试次数":             "Inter-AMF Handover Out Attempts",
  "AMF间切换出成功次数":             "Inter-AMF Handover Out Successes",
  "AMF间切换出成功率":               "Inter-AMF Handover Out Success Rate (%)",
  "AMF间切换入尝试次数":             "Inter-AMF Handover In Attempts",
  "AMF间切换入成功次数":             "Inter-AMF Handover In Successes",
  "AMF间切换入成功率":               "Inter-AMF Handover In Success Rate (%)",
  "AMF内N2接口切换尝试次数":         "Intra-AMF N2 Handover Attempts",
  "AMF内N2接口切换成功次数":         "Intra-AMF N2 Handover Successes",
  "AMF内N2接口切换成功率":           "Intra-AMF N2 Handover Success Rate (%)",
  "AMF内Xn接口切换尝试数":           "Intra-AMF Xn Handover Attempts",
  "AMF内Xn接口切换成功次数":         "Intra-AMF Xn Handover Successes",
  "AMF内Xn接口切换成功率":           "Intra-AMF Xn Handover Success Rate (%)",
  // Registration
  "初始注册成功次数":                "Initial Registration Success Count",
  "初始注册成功率":                  "Initial Registration Success Rate (%)",
  "初始注册平均时长":                "Initial Registration Avg Duration (ms)",
  "初始注册请求次数":                "Initial Registration Request Count",
  "初始注册失败次数":                "Initial Registration Failure Count",
  "注册更新成功率":                  "Registration Update Success Rate (%)",
  "注册更新接受次数":                "Registration Update Accept Count",
  "注册更新请求次数":                "Registration Update Request Count",
  "注册更新失败次数":                "Registration Update Failure Count",
  "周期性注册更新请求次数":          "Periodic Registration Update Request Count",
  "周期性注册更新接受次数":          "Periodic Registration Update Accept Count",
  // Authentication
  "鉴权请求次数":                    "Authentication Request Count",
  "鉴权成功率":                      "Authentication Success Rate (%)",
  "鉴权失败次数":                    "Authentication Failure Count",
  "鉴权拒绝次数":                    "Authentication Reject Count",
  "鉴权参数错误次数":                "Authentication Parameter Error Count",
  // Paging
  "寻呼请求次数":                    "Paging Request Count",
  "寻呼成功率":                      "Paging Success Rate (%)",
  "一次寻呼成功率":                  "First-Attempt Paging Success Rate (%)",
  "一次寻呼响应次数":                "First-Attempt Paging Response Count",
  "二次寻呼响应次数":                "Second-Attempt Paging Response Count",
  // SMF
  "SMF发起的PDU会话修改成功次数":    "SMF-Initiated PDU Session Modify Success Count",
  "SMF发起的PDU会话修改请求次数":    "SMF-Initiated PDU Session Modify Request Count",
  "SMF发起的PDU会话修改失败次数":    "SMF-Initiated PDU Session Modify Failure Count",
  // PCF policy
  "创建SM策略成功次数":              "SM Policy Create Success Count",
  "创建SM策略请求成功率":            "SM Policy Create Request Success Rate (%)",
  "创建SM策略请求的次数":            "SM Policy Create Request Count",
  "更新SM策略成功次数":              "SM Policy Update Success Count",
  "更新SM策略请求的次数":            "SM Policy Update Request Count",
  "删除SM策略成功次数":              "SM Policy Delete Success Count",
  "删除策略请求的次数":              "Policy Delete Request Count",
  // System
  "系统平均负荷":                    "System Avg Load (%)",
  "平均分配的地址数":                "Avg Allocated Address Count",
  "最大分配的地址数":                "Max Allocated Address Count",
  "Function值":                      "Function Value",
  "SubNetwork值":                    "Sub-Network Value",
  // 4G↔5G
  "从4G网络切换入5G网络尝试次数":    "4G→5G Handover Attempt Count",
  "从4G网络切换入5G网络成功次数":    "4G→5G Handover Success Count",
  "从5G网络切换出至4G网络尝试次数":  "5G→4G Handover Attempt Count",
  "从5G网络切换出至4G网络成功次数":  "5G→4G Handover Success Count",
  "更新位置成功率":                  "Location Update Success Rate (%)",
  // UE context
  "UE上下文去注册成功次数":          "UE Context De-registration Success Count",
  "UE上下文去注册请求次数":          "UE Context De-registration Request Count",
  "UE上下文注册成功次数":            "UE Context Registration Success Count",
  "UE上下文注册请求成功率":          "UE Context Registration Request Success Rate (%)",
  "UE上下文注册请求次数":            "UE Context Registration Request Count",
  "UE上下文注册失败次数":            "UE Context Registration Failure Count",
};

// ── Master translate function ─────────────────────────────────────────────────
export function translate(value: string | undefined | null, map: Record<string, string>): string {
  if (!value) return "—";
  return map[value.trim()] ?? value;
}

/**
 * Auto-detect and translate any Chinese cell value using all maps.
 * Strips pandas object wrappers like "{name=二级告警, id=2}" first.
 */
export function translateAuto(raw: string | number | undefined | null): string {
  if (raw === null || raw === undefined) return "—";
  let val = String(raw).trim();

  // Strip pandas dict wrapper: {name=X, id=Y} or {'name': 'X', 'id': 2}
  const match = val.match(/[{']?name[=: ']+([^,}']+)/);
  if (match) val = match[1].trim().replace(/^'|'$/g, "");

  return (
    ALARM_TITLE_MAP[val]  ??
    ALARM_LEVEL_MAP[val]  ??
    CITY_MAP[val]         ??
    VENDOR_MAP[val]       ??
    DEVICE_TYPE_MAP[val]  ??
    METRIC_NAME_MAP[val]  ??
    SITE_MAP[val]         ??
    val
  );
}
