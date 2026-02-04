/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 2:1304
 * specHash: sha256:app-dashboard-landing-v1
 */

/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

// Figma assets for node 2:1304 - Post Login Page
const imgIconSecure = "https://www.figma.com/api/mcp/asset/a4e08010-b508-4b4a-9d01-d405a215c90f";
const imgIconView = "https://www.figma.com/api/mcp/asset/8ee4cda1-6031-48f9-9122-7ec4e348b3b1";

export const metadata: Metadata = {
    title: "Dashboard — SkyMaintain",
    description: "Aircraft maintenance data dashboard",
};

export default function AppEntryZeroStatePage() {
    return (
        <div
            className="flex h-full w-full items-center justify-center"
            style={{
                background: "linear-gradient(143deg, #f3f4f6 0%, #e5e7eb 100%)",
            }}
            data-name="Container"
            data-node-id="2:1307"
        >
            <div
                className="flex flex-col items-center text-center"
                data-name="Container"
                data-node-id="2:1308"
            >
                {/* Title - Matches Figma node 2:1309 */}
                <h1
                    className="text-[30px] font-bold leading-9"
                    style={{ color: "#101828" }}
                    data-name="Heading 2"
                    data-node-id="2:1309"
                >
                    SkyMaintain v1.0
                </h1>

                {/* Subtitle - Matches Figma node 2:1311 */}
                <p
                    className="mt-4 max-w-[566px] text-[18px] leading-7"
                    style={{ color: "#4a5565" }}
                    data-name="Paragraph"
                    data-node-id="2:1311"
                >
                    Select an option from the left sidebar to view your aircraft maintenance data securely
                </p>

                {/* Feature Cards - Matches Figma node 2:1313 */}
                <div
                    className="mt-8 flex w-full max-w-[448px] flex-col gap-4"
                    data-name="Container"
                    data-node-id="2:1313"
                >
                    {/* Secure by Default Card - Matches Figma node 2:1314 */}
                    <div
                        className="flex items-center gap-3 rounded-[10px] bg-white px-4 py-4"
                        style={{ border: "0.8px solid #e5e7eb" }}
                        data-name="Container"
                        data-node-id="2:1314"
                    >
                        <img
                            src={imgIconSecure}
                            alt=""
                            className="h-6 w-6"
                            data-name="Icon"
                            data-node-id="2:1315"
                        />
                        <div
                            className="flex flex-col items-start text-left"
                            data-name="Container"
                            data-node-id="2:1317"
                        >
                            <p
                                className="text-[14px] leading-5"
                                style={{ color: "#101828" }}
                                data-name="Paragraph"
                                data-node-id="2:1318"
                            >
                                Secure by Default
                            </p>
                            <p
                                className="text-[12px] leading-4"
                                style={{ color: "#4a5565" }}
                                data-name="Paragraph"
                                data-node-id="2:1320"
                            >
                                Sensitive data hidden for additional security
                            </p>
                        </div>
                    </div>

                    {/* View on Demand Card - Matches Figma node 2:1322 */}
                    <div
                        className="flex items-center gap-3 rounded-[10px] bg-white px-4 py-4"
                        style={{ border: "0.8px solid #e5e7eb" }}
                        data-name="Container"
                        data-node-id="2:1322"
                    >
                        <img
                            src={imgIconView}
                            alt=""
                            className="h-6 w-6"
                            data-name="Icon"
                            data-node-id="2:1323"
                        />
                        <div
                            className="flex flex-col items-start text-left"
                            data-name="Container"
                            data-node-id="2:1326"
                        >
                            <p
                                className="text-[14px] leading-5"
                                style={{ color: "#101828" }}
                                data-name="Paragraph"
                                data-node-id="2:1327"
                            >
                                View on Demand
                            </p>
                            <p
                                className="text-[12px] leading-4"
                                style={{ color: "#4a5565" }}
                                data-name="Paragraph"
                                data-node-id="2:1329"
                            >
                                Access data when you need it
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
