export type SubscriptionTier = "starter" | "professional" | "enterprise";

export type SubscriptionEntitlements = {
    tier: SubscriptionTier;
    features: {
        // Core modules — all plans
        fleet_management: boolean;
        work_orders_job_cards: boolean;
        parts_inventory: boolean;
        maintenance_calendar: boolean;
        basic_maintenance_tracking: boolean;
        mobile_app_access: boolean;
        standard_compliance_reports: boolean;
        // Professional+
        ai_insights_reports: boolean;
        regulatory_compliance: boolean;
        api_ingestion_contracts: boolean;
        custom_compliance_reports: boolean;
        advanced_ai_insights: boolean;
        realtime_iot_integration: boolean;
        api_access_level: "none" | "basic" | "full";
        multi_location_support: boolean;
        priority_support: boolean;
        // Enterprise only
        predictive_alerts: boolean;
        dedicated_support: boolean;
        dedicated_support_24_7: boolean;
        custom_integrations: boolean;
        sla_guarantee: boolean;
    };
    limits: {
        max_aircraft: number | null;
        max_storage_gb: number | null;
        max_team_members: number | null;
    };
};

const ENTITLEMENT_BY_TIER: Record<SubscriptionTier, SubscriptionEntitlements> = {
    starter: {
        tier: "starter",
        features: {
            fleet_management: true,
            work_orders_job_cards: true,
            parts_inventory: true,
            maintenance_calendar: true,
            basic_maintenance_tracking: true,
            mobile_app_access: true,
            standard_compliance_reports: true,
            ai_insights_reports: false,
            regulatory_compliance: false,
            api_ingestion_contracts: false,
            custom_compliance_reports: false,
            advanced_ai_insights: false,
            realtime_iot_integration: false,
            api_access_level: "none",
            multi_location_support: false,
            priority_support: false,
            predictive_alerts: false,
            dedicated_support: false,
            dedicated_support_24_7: false,
            custom_integrations: false,
            sla_guarantee: false,
        },
        limits: {
            max_aircraft: 5,
            max_storage_gb: 1,
            max_team_members: 5,
        },
    },
    professional: {
        tier: "professional",
        features: {
            fleet_management: true,
            work_orders_job_cards: true,
            parts_inventory: true,
            maintenance_calendar: true,
            basic_maintenance_tracking: true,
            mobile_app_access: true,
            standard_compliance_reports: true,
            ai_insights_reports: true,
            regulatory_compliance: true,
            api_ingestion_contracts: true,
            custom_compliance_reports: true,
            advanced_ai_insights: true,
            realtime_iot_integration: true,
            api_access_level: "basic",
            multi_location_support: true,
            priority_support: true,
            predictive_alerts: false,
            dedicated_support: false,
            dedicated_support_24_7: false,
            custom_integrations: false,
            sla_guarantee: false,
        },
        limits: {
            max_aircraft: 25,
            max_storage_gb: 50,
            max_team_members: 25,
        },
    },
    enterprise: {
        tier: "enterprise",
        features: {
            fleet_management: true,
            work_orders_job_cards: true,
            parts_inventory: true,
            maintenance_calendar: true,
            basic_maintenance_tracking: true,
            mobile_app_access: true,
            standard_compliance_reports: true,
            ai_insights_reports: true,
            regulatory_compliance: true,
            api_ingestion_contracts: true,
            custom_compliance_reports: true,
            advanced_ai_insights: true,
            realtime_iot_integration: true,
            api_access_level: "full",
            multi_location_support: true,
            priority_support: true,
            predictive_alerts: true,
            dedicated_support: true,
            dedicated_support_24_7: true,
            custom_integrations: true,
            sla_guarantee: true,
        },
        limits: {
            max_aircraft: null,
            max_storage_gb: null,
            max_team_members: null,
        },
    },
};

export function normalizeTier(value?: string | null): SubscriptionTier {
    const normalized = (value || "").trim().toLowerCase();
    if (normalized === "enterprise") return "enterprise";
    if (normalized === "professional" || normalized === "pro") return "professional";
    return "starter";
}

export function getEntitlementsForTier(tier?: string | null): SubscriptionEntitlements {
    const normalized = normalizeTier(tier);
    return ENTITLEMENT_BY_TIER[normalized];
}
