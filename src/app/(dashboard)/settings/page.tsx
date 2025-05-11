import InfoBar from "@/components/infobar";
import BillingSettings from "@/components/settings/billings-settings";
import React from "react";

const page = () => {
  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0 flex flex-col gap-10">
        <BillingSettings />
      </div>
    </>
  );
};

export default page;
