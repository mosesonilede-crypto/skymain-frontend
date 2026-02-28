import { NextRequest, NextResponse } from "next/server";
import { fetchMaintenanceLogs } from "@/lib/integrations/cmms";
import { getIntegrationConfig } from "@/lib/integrations/config";

// Realistic maintenance log data generator
function generateMaintenanceLogs(aircraftReg: string) {
    const logTemplates = [
        {
            type: "A-Check",
            title: "A-Check Inspection",
            description: "Complete A-Check including visual inspection, lubrication, and minor repairs",
            durationHours: 18,
        },
        {
            type: "Avionics",
            title: "Avionics Software Update",
            description: "Critical avionics software update for FMS and TCAS systems",
            durationHours: 4,
        },
        {
            type: "Landing Gear",
            title: "Landing Gear Inspection",
            description: "Routine landing gear inspection and hydraulic fluid check",
            durationHours: 6,
        },
        {
            type: "Engine",
            title: "Engine Oil Analysis",
            description: "Scheduled engine oil sampling and analysis for wear metal detection",
            durationHours: 2,
        },
        {
            type: "Pressurization",
            title: "Cabin Pressure System Check",
            description: "Inspection of cabin pressurization system and outflow valves",
            durationHours: 5,
        },
        {
            type: "Electrical",
            title: "Electrical System Test",
            description: "Comprehensive electrical system diagnostic and battery load test",
            durationHours: 3,
        },
        {
            type: "Hydraulics",
            title: "Hydraulic System Service",
            description: "Hydraulic fluid replacement and system pressure test",
            durationHours: 4,
        },
        {
            type: "Flight Controls",
            title: "Flight Control Rigging",
            description: "Flight control surfaces rigging check and adjustment",
            durationHours: 8,
        },
    ];

    const technicians = [
        "John Anderson",
        "Sarah Williams",
        "Mike Chen",
        "Emily Davis",
        "Robert Martinez",
        "Jessica Thompson",
        "David Wilson",
        "Amanda Garcia",
    ];

    const statuses = ["Completed", "Completed", "Completed", "Completed", "In Progress"];

    // Generate logs going back in time
    const logs = logTemplates.slice(0, 6).map((template, i) => {
        const daysAgo = i * 7; // Weekly intervals
        const logDate = new Date();
        logDate.setDate(logDate.getDate() - daysAgo);

        return {
            id: `log-${aircraftReg}-${i + 1}`,
            date: logDate.toISOString(),
            type: template.type,
            title: template.title,
            description: template.description,
            technician: technicians[i % technicians.length],
            status: statuses[Math.min(i, statuses.length - 1)],
            durationHours: template.durationHours,
            parts: [],
            notes: i === 0 ? "Most recent maintenance completed successfully." : "",
        };
    });

    return logs;
}

function generateUpcomingTasks(aircraftReg: string) {
    const tasks = [
        {
            title: "B-Check Inspection",
            description: "Scheduled B-Check covering structural inspection, systems checks, and component replacements",
            estimatedHours: 120,
            priority: "HIGH",
            category: "Scheduled Maintenance",
            daysFromNow: 14,
        },
        {
            title: "Engine Borescope Inspection",
            description: "Routine borescope inspection of engine hot section for turbine blade condition",
            estimatedHours: 8,
            priority: "MEDIUM",
            category: "Engine",
            daysFromNow: 21,
        },
        {
            title: "Hydraulic Fluid Replacement",
            description: "Scheduled replacement of hydraulic fluid and contamination check",
            estimatedHours: 6,
            priority: "MEDIUM",
            category: "Hydraulics",
            daysFromNow: 30,
        },
    ];

    return tasks.map((task, i) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + task.daysFromNow);
        return {
            id: `upcoming-${aircraftReg}-${i + 1}`,
            title: task.title,
            description: task.description,
            dueDate: dueDate.toISOString().slice(0, 10),
            estimatedHours: task.estimatedHours,
            priority: task.priority as "HIGH" | "MEDIUM" | "LOW",
            category: task.category,
        };
    });
}


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    const { aircraftReg: reg } = await params;
    const aircraftReg = reg.toUpperCase();

    // If no CMMS integration is configured, serve demo data immediately
    // instead of calling fetchMaintenanceLogs (which would throw).
    const cmmsConfig = getIntegrationConfig("cmms");
    if (!cmmsConfig) {
        const mockData = {
            aircraftReg,
            logs: generateMaintenanceLogs(aircraftReg),
            upcomingTasks: generateUpcomingTasks(aircraftReg),
            lastUpdated: new Date().toISOString(),
            source: "mock",
            fallback: true,
        };
        return NextResponse.json(mockData, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    }

    try {
        const data = await fetchMaintenanceLogs(aircraftReg);
        return NextResponse.json({ ...data, source: "live" }, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    } catch (error) {
        console.error("Error fetching logs from CMMS:", error);
        return NextResponse.json(
            { error: "Failed to fetch maintenance logs from CMMS" },
            { status: 503 }
        );
    }
}
