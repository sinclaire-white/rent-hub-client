export function verifyRole(user, allowedRoles = []) {
    if (!user || !allowedRoles.includes(user.role)) {
        return false;
    }
    return true;
}
