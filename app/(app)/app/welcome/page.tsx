/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

const iconSecure = "https://www.figma.com/api/mcp/asset/1919817c-907c-419b-926d-3c7000be0aef";
const iconView = "https://www.figma.com/api/mcp/asset/641fbafe-09f6-490d-84f8-ddb402e7c844";

export default function WelcomePage() {
    return (
        <div className="flex min-h-[620px] items-center justify-center">
            <div className="w-full max-w-[672px] px-6 py-10">
                <h1 className="text-center text-[30px] font-semibold leading-[36px] text-[#101828]">
                    SkyMaintain v1.0
                </h1>

                <p className="mx-auto mt-4 max-w-[566px] text-center text-[18px] leading-[28px] text-[#4a5565]">
                    Select an option from the left sidebar to view your aircraft maintenance data securely
                </p>

                <div className="mx-auto mt-8 flex w-full max-w-[448px] flex-col gap-4">
                    <div className="flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3">
                        <img alt="" className="h-6 w-6" src={iconSecure} />
                        <div>
                            <div className="text-[14px] leading-[20px] text-[#101828]">Secure by Default</div>
                            <div className="text-[12px] leading-[16px] text-[#4a5565]">
                                Sensitive data hidden for additional security
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3">
                        <img alt="" className="h-6 w-6" src={iconView} />
                        <div>
                            <div className="text-[14px] leading-[20px] text-[#101828]">View on Demand</div>
                            <div className="text-[12px] leading-[16px] text-[#4a5565]">Access data when you need it</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
