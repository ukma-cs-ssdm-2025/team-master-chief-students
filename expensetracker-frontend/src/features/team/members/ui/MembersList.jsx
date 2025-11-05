import React, { useState } from "react";
import { ChangeRoleConfirmModal } from "../../change-role";

export const MembersList = ({ members, currentUserId, onChangeRole, onRemove, canManage }) => {
  const [changingRole, setChangingRole] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const handleChangeRoleClick = (member) => {
    const newRole = member.role === "MEMBER" ? "ADMIN" : "MEMBER";
    setConfirmModal({
      userId: member.userId,
      memberName: member.email?.split('@')[0] || member.email,
      currentRole: member.role,
      newRole,
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!confirmModal) return;

    setChangingRole(confirmModal.userId);
    try {
      await onChangeRole(confirmModal.userId, confirmModal.newRole);
      setConfirmModal(null);
    } catch (err) {
      alert(err.message || "Failed to change role");
    } finally {
      setChangingRole(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    setRemoving(userId);
    try {
      await onRemove(userId);
    } catch (err) {
      alert(err.message || "Failed to remove member");
    } finally {
      setRemoving(null);
    }
  };

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No members in this team
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.userId}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {member.role?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {member.email?.split('@')[0] || member.email}
                {member.userId === currentUserId && (
                  <span className="text-xs text-gray-500">(You)</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                member.role === "OWNER"
                  ? "bg-purple-100 text-purple-700"
                  : member.role === "ADMIN"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {member.role}
            </span>

            {canManage && member.role !== "OWNER" && member.userId !== currentUserId && (
              <>
                <button
                  onClick={() => handleChangeRoleClick(member)}
                  disabled={changingRole === member.userId}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Change role"
                >
                  {changingRole === member.userId ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleRemove(member.userId)}
                  disabled={removing === member.userId}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove member"
                >
                  {removing === member.userId ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {confirmModal && (
        <ChangeRoleConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirmRoleChange}
          currentRole={confirmModal.currentRole}
          newRole={confirmModal.newRole}
          memberName={confirmModal.memberName}
        />
      )}
    </div>
  );
};