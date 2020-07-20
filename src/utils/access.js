
const perms = {
  admin: 'admin',
  write: 'write',
};

export function localUserId(sharedFS) {
  return sharedFS._db.identity.id;
};

export function writers(sharedFS) {
  return sharedFS.access.get(perms.write);
};

export function admin(sharedFS) {
  return sharedFS.access.get(perms.admin);
};

export async function grantWrite(sharedFS, userId) {
  return sharedFS.access.grant(perms.write, userId);
};

export function hasWrite(sharedFS, userId = localUserId(sharedFS)) {
  return new Set([...writers(sharedFS), ...admin(sharedFS)]).has(userId);
}

export function hasAdmin(sharedFS, userId = localUserId(sharedFS)) {
  return admin(sharedFS).has(userId);
}
