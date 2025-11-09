import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useTeamDetails } from "@entities/team";
import { MembersList } from "@features/team/members/ui/MembersList";
import { AddMemberForm } from "@features/team/add-member/ui/AddMemberForm";
import { Modal } from "@shared/ui";

export const TeamMembersTab = () => {
  const { teamId } = useParams();
  const { team, userRole, currentUserId } = useOutletContext();

  const {
    addMember,
    changeMemberRole,
    removeMember,
  } = useTeamDetails(parseInt(teamId));

  const [showAddMember, setShowAddMember] = useState(false);

  const canManage = userRole === "OWNER" || userRole === "ADMIN";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {canManage && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddMember(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+ Add Member</span>
          </button>
        </div>
      )}

      <MembersList
        members={team?.members || []}
        currentUserId={currentUserId}
        onChangeRole={changeMemberRole}
        onRemove={removeMember}
        canManage={canManage}
      />

      {showAddMember && (
        <Modal onClose={() => setShowAddMember(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Team Member</h2>
            <AddMemberForm
              onAdd={async (memberData) => {
                await addMember(memberData);
                setShowAddMember(false);
              }}
              onCancel={() => setShowAddMember(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

