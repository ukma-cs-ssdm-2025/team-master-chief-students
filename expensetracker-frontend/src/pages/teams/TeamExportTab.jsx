import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { TeamExpenseExport } from "@features/team/export/ui/TeamExpenseExport";

export const TeamExportTab = () => {
  const { teamId } = useParams();
  const { userRole } = useOutletContext();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <TeamExpenseExport teamId={parseInt(teamId)} userRole={userRole} />
    </div>
  );
};

